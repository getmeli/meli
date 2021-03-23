import React from 'react';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLink } from '@fortawesome/free-solid-svg-icons';
import emailIcon from '../../assets/images/notifications/email.svg';
import slackIcon from '../../assets/images/notifications/slack.svg';
import mattermostIcon from '../../assets/images/notifications/mattermost.svg';
import styles from './HookTypeIcon.module.scss';
import { HookType } from './hook';

export function HookTypeIcon({ type, className }: {
  type: HookType;
  className?: any;
}) {
  switch (type) {
    case HookType.email:
      return (
        <img src={emailIcon} alt="email" className={classNames(className, styles.icon)} />
      );
    case HookType.mattermost:
      return (
        <img src={mattermostIcon} alt="mattermost" className={classNames(className, styles.icon)} />
      );
    case HookType.slack:
      return (
        <img src={slackIcon} alt="slack" className={classNames(className, styles.icon)} />
      );
    case HookType.web:
      return <FontAwesomeIcon icon={faLink} className={classNames(className, styles.icon)} />;
    default:
      return (
        <></>
      );
  }
}
