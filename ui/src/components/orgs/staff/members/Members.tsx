import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { AlertError } from "../../../../commons/components/AlertError";
import { LoadMore } from "../../../../commons/components/LoadMore";
import { SearchInput } from "../../../sites/releases/SearchInput";
import { useOrg } from "../../OrgView";
import { getMembers, OrgMembersSearchQuery } from "./get-members";
import { useMountedState } from "../../../../commons/hooks/use-mounted-state";
import { MemberView } from "./MemberView";
import { OrgMember } from "./org-member";
import { OrgMemberIcon } from "../../../icons/OrgMemberIcon";
import { Loader } from "../../../../commons/components/Loader";
import { extractErrorMessage } from "../../../../utils/extract-error-message";

export function Members() {
  const [loading, setLoading] = useMountedState(true);
  const [error, setError] = useState();
  const [items, setItems] = useState<OrgMember[]>([]);
  const { org } = useOrg();

  const itemsRef = useRef<OrgMember[]>([]);
  const [canLoadMore, setCanLoadMore] = useState(false);
  const [searching, setSearching] = useState(false);
  const previousSearch = useRef("");
  const [search, setSearch] = useState("");
  const searchQueryRef = useRef({
    search: "",
    page: 0,
    size: 10,
  });
  const [searchQuery, setSearchQuery] = useState<OrgMembersSearchQuery>(
    searchQueryRef.current
  );

  useEffect(() => {
    // prevents duplicate calls when search input is initialized
    if (search === previousSearch.current) {
      return;
    }

    let query: OrgMembersSearchQuery = {
      ...searchQueryRef.current,
      search,
    };

    // start to search
    if (search && search !== previousSearch.current) {
      query = {
        ...query,
        page: 0,
      };
    }

    // stop searching (cleared search)
    if (previousSearch.current && !search) {
      query = {
        ...query,
        page: 0,
      };
      itemsRef.current = [];
    }

    previousSearch.current = search;

    setSearchQuery(query);
  }, [search]);

  useEffect(() => {
    if (searchQuery.search) {
      setSearching(true);
    }

    setLoading(true);
    setError(undefined);

    getMembers(org._id, searchQuery)
      .then((data) => {
        itemsRef.current = searchQuery.search
          ? data.items
          : [...itemsRef.current, ...data.items];
        setItems(itemsRef.current);
        setCanLoadMore(itemsRef.current.length !== data.count);
      })
      .catch(setError)
      .catch((err) =>
        toast.error(`Could not list members: ${extractErrorMessage(err)}`)
      )
      .finally(() => {
        setSearching(false);
        setLoading(false);
      });
  }, [org, searchQuery, setLoading]);

  const nextPage = () => {
    setSearchQuery({
      ...searchQuery,
      page: searchQuery.page + 1,
    });
  };

  const onDelete = (memberId: string) => {
    setItems(items.filter(({ _id }) => _id !== memberId));
  };

  const onEdit = (member: OrgMember) => {
    setItems(items.map((item) => (item._id === member._id ? member : item)));
  };

  return (
    <>
      <div className="mt-4 card">
        <div className="card-header d-flex justify-content-between">
          <div>
            <OrgMemberIcon className="mr-2" />
            <strong>Members</strong>
          </div>
          <div>
            <SearchInput
              loading={searching}
              search={searchQuery.search}
              setSearch={setSearch}
              placeholder="Search members"
            />
          </div>
        </div>
        <div className="card-body">
          {loading ? (
            <Loader />
          ) : error ? (
            <AlertError error={error} />
          ) : items.length === 0 ? (
            <>No search results found</>
          ) : (
            <ul className="list-group">
              {items.map((member) => (
                <MemberView
                  key={member._id}
                  member={member}
                  onDelete={() => onDelete(member._id)}
                  setMember={onEdit}
                />
              ))}
              {canLoadMore && (
                <LoadMore
                  onClick={nextPage}
                  loading={loading}
                  disabled={loading}
                />
              )}
              {error && <AlertError error={error} className="mt-4" />}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}
