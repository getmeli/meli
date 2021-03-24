import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-toastify';
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames';
import { ButtonIcon } from '../../commons/components/ButtonIcon';
import { Bubble } from '../../commons/components/Bubble';
import { axios } from '../../providers/axios';
import styles from './Logo.module.scss';

interface Value {
  _id: string;
  logo?: string;
}

export function Logo<T extends Value>({ context, value, setValue, className }: {
  context: string;
  value: T;
  setValue: (value: T) => void;
  className?: any;
}) {
  const [uploading, setUploading] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);

  const onFileDropped = acceptedFiles => {
    setIsDragActive(false);
    setUploading(true);
    const formData = new FormData();
    formData.append('file', acceptedFiles[0]);
    axios
      .post<T>(`/api/v1/${context}/${value._id}/logo`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(({ data }) => {
        setValue(data);
      })
      .catch(err => {
        toast.error(`Could not upload logo: ${err}`);
      })
      .finally(() => setUploading(false));
  };

  const [removing, setRemoving] = useState(false);

  const removeLogo = () => {
    setRemoving(true);
    axios
      .delete<T>(`/api/v1/${context}/${value._id}/logo`)
      .then(({ data }) => {
        setValue(data);
      })
      .catch(err => {
        toast.error(`Could not remove logo: ${err}`);
      })
      .finally(() => setRemoving(false));
  };

  const { getRootProps, getInputProps, open } = useDropzone({
    noClick: true,
    noKeyboard: true,
    multiple: false,
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
    onDrop: onFileDropped,
  });

  return (
    <div
      className={classNames('card', className, styles.dropzone, {
        [styles.active]: isDragActive,
      })}
      {...getRootProps()}
    >
      <div className="card-header">
        <strong>Logo</strong>
      </div>
      <div className="card-body d-flex justify-content-between align-items-center">
        {value.logo ? (
          <Bubble src={value.logo} className={styles.logo}/>
        ) : (
          <div className="text-muted">
            Drag a file here
          </div>
        )}
        <div className="d-flex align-items-center">
          <input {...getInputProps()} />
          <ButtonIcon loading={uploading} onClick={open}>
            <FontAwesomeIcon icon={faUpload}/>
          </ButtonIcon>
          {value.logo && (
            <ButtonIcon loading={removing} onClick={removeLogo}>
              <FontAwesomeIcon icon={faTrashAlt}/>
            </ButtonIcon>
          )}
        </div>
      </div>
    </div>
  );
}
