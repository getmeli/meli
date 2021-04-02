import React from "react";
import { ExternalLink } from '../commons/components/ExternalLink';
import { useLocalStorage } from '../utils/use-local-storage';
import styles from './PosthogWarning.module.scss';
import classNames from 'classnames';
import { AppModal } from '../commons/components/modals/AppModal';
import postHogLogo from './posthog.svg';
import meliLogo from './meli.svg';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export function PosthogWarning({ className }: {
  className?: string;
}) {
  const [show, setShow] = useLocalStorage('posthog.warning.show', true);
  return (
    <AppModal isOpen={show}>
      <div className={classNames(styles.container, className)}>
        <div className={styles.logos}>
          <img src={postHogLogo} alt="posthog" className={styles.posthogLogo}/>
          <FontAwesomeIcon icon={faPlus} className={styles.plus}/>
          <img src={meliLogo} alt="meli" className={styles.meliLogo}/>
        </div>
        <div className="mt-4 text-center">
          We've added <ExternalLink href="https://github.com/PostHog/posthog">PostHog</ExternalLink> to Meli.
          It helps us know which versions are being used in production and how many active installations are being deployed across the world.
          You may opt-out of this feature. Please review <ExternalLink href="https://github.com/getmeli/meli/issues/220">this thread</ExternalLink> for more info.
        </div>
        <div className="mt-4 text-center">
          <button type="button" className="btn btn-success" onClick={() => setShow(false)}>
            I've read the thread
          </button>
        </div>
      </div>
    </AppModal>
  )
}
