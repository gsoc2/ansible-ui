import { TrashIcon, ThumbsUpIcon } from '@patternfly/react-icons';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { IPageAction, PageActionSelection, PageActionType } from '../../../../framework';
import { useApproveCollections } from './useApproveCollections';
import { useRejectCollections } from './useRejectCollections';
import { CollectionVersionSearch } from '../Approval';
import { useHubContext } from './../../useHubContext';

export function useApprovalsActions(callback: (collections: CollectionVersionSearch[]) => void) {
  const { t } = useTranslation();
  const rejectCollections = useRejectCollections(callback);
  const approveCollections = useApproveCollections(callback);
  const { featureFlags } = useHubContext();
  const { collection_auto_sign, require_upload_signatures } = featureFlags;
  const autoSign = collection_auto_sign && !require_upload_signatures;

  return useMemo<IPageAction<CollectionVersionSearch>[]>(
    () => [
      {
        type: PageActionType.Button,
        selection: PageActionSelection.Multiple,
        icon: TrashIcon,
        label: t('Reject selected collections'),
        onClick: rejectCollections,
        isDanger: true,
      },
      { type: PageActionType.Seperator },
      {
        type: PageActionType.Button,
        selection: PageActionSelection.Multiple,
        icon: ThumbsUpIcon,
        label: autoSign
          ? t('Sign and approve selected collections')
          : t('Approve selected collections'),
        onClick: approveCollections,
        isDanger: false,
      },
    ],
    [t, rejectCollections, approveCollections, autoSign]
  );
}
