import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { getMembers, OrgMembersSearchQuery } from '../../../orgs/staff/members/get-members';
import { OrgMember } from '../../../orgs/staff/members/org-member';
import { CardModal } from '../../../../commons/components/modals/CardModal';
import { SearchInput } from '../../../sites/releases/SearchInput';
import { LoadMore } from '../../../../commons/components/LoadMore';
import { Loader } from '../../../../commons/components/Loader';
import { AlertError } from '../../../../commons/components/AlertError';
import styles from './AddMember.module.scss';
import { ListItem } from './ListItem';
import { useCurrentOrg } from '../../../../providers/OrgProvider';
import { useMountedState } from '../../../../commons/hooks/use-mounted-state';
import { IsAdmin } from '../../../auth/IsAdmin';
import { TeamMember } from '../team-member';

export function AddMember({
  teamId, className, children, onAdded,
}: {
  teamId: string;
  children: any;
  className?: string;
  onAdded: (member: TeamMember) => void;
}) {
  const [isOpen, setIsOpen] = useMountedState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const { currentOrg } = useCurrentOrg();
  const [loading, setLoading] = useMountedState(false);
  const [error, setError] = useState();
  const [query, setQuery] = useState<OrgMembersSearchQuery>({
    search: '', page: 0, size: 10,
  });
  const [items, setItems] = useState<OrgMember[]>([]);
  const itemsRef = useRef<OrgMember[]>([]);
  const [canLoadMore, setCanLoadMore] = useState(false);

  useEffect(() => {
    setError(undefined);
    setLoading(true);
    getMembers(currentOrg.org._id, query)
      .then(data => {
        itemsRef.current = [...itemsRef.current, ...data.items];
        setItems(itemsRef.current);
        setCanLoadMore(itemsRef.current.length !== data.count);
      })
      .catch(setError)
      .catch(err => {
        toast.error(`Could not search releases: ${err}`);
      })
      .finally(() => {
        setLoading(false);
        setInitialLoad(false);
      });
  }, [currentOrg, query, setLoading]);

  const nextPage = () => {
    setQuery({
      ...query,
      page: query.page + 1,
    });
  };

  const onTeamMemberAdded = (member: TeamMember) => {
    setIsOpen(false);
    onAdded(member);
  };

  const onSearch = val => {
    itemsRef.current = [];
    setQuery({
      ...query, search: val, page: 0,
    });
  };

  return (
    <>
      <CardModal
        isOpen={isOpen}
        title="Add member"
        closeModal={() => setIsOpen(false)}
        className={styles.modal}
      >
        <SearchInput
          search={query.search}
          setSearch={onSearch}
          loading={loading}
          className="mb-4"
        />
        {initialLoad ? (
          <Loader/>
        ) : error ? (
          <AlertError error={error}/>
        ) : (
          <ul className="list-group">
            {items.map(item => (
              <ListItem
                key={item._id}
                member={item}
                teamId={teamId}
                onAdded={onTeamMemberAdded}
              />
            ))}
            {canLoadMore && (
              <LoadMore
                onClick={nextPage}
                loading={loading}
                disabled={loading}
              />
            )}
          </ul>
        )}
      </CardModal>
      <IsAdmin>
        <div onClick={() => setIsOpen(true)} className={className}>
          {children}
        </div>
      </IsAdmin>
    </>
  );
}
