import { ButtonVariant, PageSection, Skeleton, Tooltip } from '@patternfly/react-core';
import { DropdownPosition } from '@patternfly/react-core/deprecated';
import { EditIcon, HeartbeatIcon } from '@patternfly/react-icons';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import {
  BytesCell,
  CapacityCell,
  DateTimeCell,
  IPageAction,
  PageActionSelection,
  PageActionType,
  PageActions,
  PageDetail,
  PageDetails,
  PageHeader,
  PageLayout,
  useGetPageUrl,
  usePageNavigate,
} from '../../../../framework';
import { LoadingPage } from '../../../../framework/components/LoadingPage';
import { StatusCell } from '../../../common/Status';
import { useGetItem } from '../../../common/crud/useGet';
import { usePostRequest } from '../../../common/crud/usePostRequest';
import { PageErrorState } from '../../../../framework/components/PageErrorState';
import { Instance } from '../../interfaces/Instance';

import { Dotted } from '../../../../framework/components/Dotted';
import { capitalizeFirstLetter } from '../../../../framework/utils/strings';
import { AwxRoute } from '../../AwxRoutes';
import { useNodeTypeTooltip } from './hooks/useNodeTypeTooltip';

export function InstanceDetails() {
  const { t } = useTranslation();
  const params = useParams<{ id: string }>();
  const { error, data: instance, refresh } = useGetItem<Instance>('/api/v2/instances', params.id);
  const pageNavigate = usePageNavigate();
  const postRequest = usePostRequest();
  const itemActions: IPageAction<Instance>[] = useMemo(() => {
    const itemActions: IPageAction<Instance>[] = [
      {
        type: PageActionType.Button,
        selection: PageActionSelection.Single,
        variant: ButtonVariant.primary,
        isPinned: true,
        icon: EditIcon,
        label: t('Edit instance'),
        onClick: (instance) => pageNavigate(AwxRoute.EditInstance, { params: { id: instance.id } }),
      },
      {
        type: PageActionType.Button,
        selection: PageActionSelection.Single,
        icon: HeartbeatIcon,
        variant: ButtonVariant.secondary,
        isPinned: true,
        label: t('Run health check'),
        onClick: () => {
          void postRequest(`/api/v2/instances/${instance?.id ?? 0}/health_check/`, {});
        },
      },
    ];
    return itemActions;
  }, [t, pageNavigate, postRequest, instance?.id]);

  const getPageUrl = useGetPageUrl();

  if (error) return <PageErrorState error={error} handleRefresh={refresh} />;
  if (!instance) return <LoadingPage breadcrumbs tabs />;

  return (
    <PageLayout>
      <PageHeader
        title={instance?.hostname}
        breadcrumbs={[
          { label: t('Instances'), to: getPageUrl(AwxRoute.Instances) },
          { label: instance?.hostname },
        ]}
        headerActions={
          <PageActions<Instance> actions={itemActions} position={DropdownPosition.right} />
        }
      />
      {instance ? (
        <InstanceDetailsTab instance={instance} />
      ) : (
        <PageSection variant="light">
          <Skeleton />
        </PageSection>
      )}
    </PageLayout>
  );
}

function InstanceDetailsTab(props: { instance: Instance }) {
  const { t } = useTranslation();
  const { instance } = props;
  const toolTipMap: { [item: string]: string } = useNodeTypeTooltip();
  return (
    <PageDetails>
      <PageDetail label={t('Name')}>{instance.hostname}</PageDetail>
      <PageDetail label={t('Node type')}>
        <Tooltip content={toolTipMap[instance.node_type]}>
          <Dotted>{`${capitalizeFirstLetter(instance.node_type)}`}</Dotted>
        </Tooltip>
      </PageDetail>
      <PageDetail label={t('Status')}>
        <StatusCell
          status={!instance.enabled ? 'disabled' : instance.errors ? 'error' : 'healthy'}
        />
      </PageDetail>
      <PageDetail label={t('Used capacity')}>
        <CapacityCell used={instance.consumed_capacity} capacity={instance.capacity} />
      </PageDetail>
      <PageDetail label={t('Running jobs')}>{instance.jobs_running.toString()}</PageDetail>
      <PageDetail label={t('Total jobs')}>{instance.jobs_total.toString()}</PageDetail>
      <PageDetail label={t('Policy type')}>
        {instance.managed_by_policy ? t('Auto') : t('Manual')}
      </PageDetail>
      <PageDetail label={t('Memory')}>
        <BytesCell bytes={instance.memory} />
      </PageDetail>
      <PageDetail label={t('Last health check')}>
        <DateTimeCell format="since" value={instance.last_health_check} />
      </PageDetail>
      <PageDetail label={t('Created')}>
        <DateTimeCell format="since" value={instance.created} />
      </PageDetail>
      <PageDetail label={t('Modified')}>
        <DateTimeCell format="since" value={instance.modified} />
      </PageDetail>
    </PageDetails>
  );
}
