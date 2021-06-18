import React, { useState } from 'react';
import { AddServiceModal } from './AddServiceModal';
import { AddSiteModal } from './AddSiteModal';

type SiteTypeChoice = 'static' | 'service';

interface AddStaticSiteOrServiceModalProps {
  projectId: string;
  closeModal: () => void;
}

export function AddStaticSiteOrServiceModal({ projectId, closeModal }: AddStaticSiteOrServiceModalProps) {
  const [choice, setChoice] = useState<SiteTypeChoice | undefined>();

  const back = () => setChoice(undefined);

  return <>
    {choice === undefined &&
      <div className="row">
        <div className="col-6">
          <button className="btn btn-default" onClick={() => setChoice('static')}>
            Static site
          </button>
        </div>
        <div className="col-6">
          <button className="btn btn-default" onClick={() => setChoice('service')}>
            Service
          </button>
        </div>
      </div>
    }
    {choice === 'static' &&
      <AddSiteModal projectId={projectId} closeModal={closeModal} back={back}/>
    }
    {choice === 'service' &&
      <AddServiceModal projectId={projectId} closeModal={closeModal} back={back}/>
    }
  </>
}
