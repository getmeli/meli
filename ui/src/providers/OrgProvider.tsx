import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { toast } from "react-toastify";
import { axios } from "./axios";
import { OrgMember } from "../components/orgs/staff/members/org-member";
import { Org } from "../components/orgs/org";
import { routerHistory } from "./history";
import { useAuth } from "./AuthProvider";
import { FullPageCentered } from "../commons/components/FullPageCentered";
import { Loader } from "../commons/components/Loader";
import { extractErrorMessage } from "../utils/extract-error-message";

export interface CurrentOrg {
  org: Org;
  member: OrgMember;
  isAdmin: boolean;
  isOwner: boolean;
  isAdminOrOwner: boolean;
}

interface OrgContext {
  initialized: boolean;
  loading: boolean;
  currentOrg: CurrentOrg;
  setCurrentOrg: (currentOrg: CurrentOrg) => void;
  changeCurrentOrg: (orgId: string) => Promise<void>;
  signOutOrg: () => void;
}

export const Context = createContext<OrgContext>(undefined);

export const useCurrentOrg = () => useContext(Context);

const storageKey = "org";

export function OrgProvider(props) {
  const [initialized, setInitialized] = useState(
    !localStorage.getItem(storageKey)
  );
  const [loading, setLoading] = useState(!!localStorage.getItem(storageKey));
  const [currentOrg, setCurrentOrg] = useState<CurrentOrg>();
  const { user } = useAuth();

  const signOutOrg = () => {
    setCurrentOrg(null);
    localStorage.setItem(storageKey, "");
    routerHistory.push("/orgs");
  };

  const changeCurrentOrg = useCallback((orgId: string) => {
    setLoading(true);
    return Promise.all([
      axios.get<Org>(`/api/v1/orgs/${orgId}`),
      axios.get<OrgMember>(`/api/v1/orgs/${orgId}/member`),
    ])
      .then(([{ data: org }, { data: member }]) => {
        const newCurrentOrg: CurrentOrg = {
          org,
          member,
          isAdmin: member.admin,
          isOwner: member.owner,
          isAdminOrOwner: member.admin || member.owner,
        };
        setCurrentOrg(newCurrentOrg);
        localStorage.setItem(storageKey, newCurrentOrg?.org._id);
      })
      .finally(() => {
        setInitialized(true);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const orgId = localStorage.getItem(storageKey);
    if (user && orgId) {
      changeCurrentOrg(orgId).catch((err) => {
        toast.error(`Could not get current org: ${extractErrorMessage(err)}`);
        signOutOrg();
      });
    } else {
      setInitialized(true);
      setLoading(false);
    }
  }, [setLoading, user, changeCurrentOrg]);

  const contextValue: OrgContext = {
    initialized,
    loading,
    currentOrg,
    setCurrentOrg,
    changeCurrentOrg,
    signOutOrg,
  };

  return !initialized ? (
    <FullPageCentered>
      <p>
        Loading organization
        <Loader className="ml-2" />
      </p>
    </FullPageCentered>
  ) : (
    <Context.Provider value={contextValue} {...props} />
  );
}
