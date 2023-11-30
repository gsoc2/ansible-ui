import { useTranslation } from 'react-i18next';
import {
  IPageAction,
  PageActionSelection,
  PageActionType,
  PageTable,
  usePageNavigate,
} from '../../../../framework';
import { AwxRoute } from '../../AwxRoutes';
import { useAwxView } from '../../useAwxView';
import { JobTemplate } from '../../interfaces/JobTemplate';
import { WorkflowJobTemplate } from '../../interfaces/WorkflowJobTemplate';
import { usePersistentFilters } from '../../../common/PersistentFilters';
import { useTemplateFilters } from './hooks/useTemplateFilters';
import { useTemplateColumns } from './hooks/useTemplateColumns';
import { useDeleteTemplates } from './hooks/useDeleteTemplates';
import { useMemo } from 'react';
import { PlusCircleIcon, TrashIcon } from '@patternfly/react-icons';
import { ButtonVariant } from '@patternfly/react-core';
import { useTemplateActions } from './hooks/useTemplateActions';

export function TemplatesList(props: { url: string }) {
  const { t } = useTranslation();
  const pageNavigate = usePageNavigate();
  const toolbarFilters = useTemplateFilters();
  const tableColumns = useTemplateColumns();
  const view = useAwxView<JobTemplate | WorkflowJobTemplate>({
    url: props.url,
    toolbarFilters,
    tableColumns,
    queryParams: {
      type: 'job_template,workflow_job_template',
    },
  });
  usePersistentFilters('templates');
  const deleteTemplates = useDeleteTemplates(view.unselectItemsAndRefresh);

  const toolbarActions = useMemo<IPageAction<JobTemplate | WorkflowJobTemplate>[]>(
    () => [
      {
        type: PageActionType.Dropdown,
        variant: ButtonVariant.primary,
        isPinned: true,
        label: t('Create template'),
        selection: PageActionSelection.None,
        icon: PlusCircleIcon,
        actions: [
          {
            type: PageActionType.Button,
            selection: PageActionSelection.None,
            label: t('Create job template'),
            onClick: () => pageNavigate(AwxRoute.CreateJobTemplate),
          },
          {
            type: PageActionType.Button,
            selection: PageActionSelection.None,
            label: t('Create workflow job template'),
            onClick: () => pageNavigate(AwxRoute.CreateWorkflowJobTemplate),
          },
        ],
      },
      {
        type: PageActionType.Button,
        selection: PageActionSelection.Multiple,
        icon: TrashIcon,
        label: 'Delete selected templates',
        onClick: deleteTemplates,
        isDanger: true,
      },
    ],
    [deleteTemplates, pageNavigate, t]
  );

  const rowActions = useTemplateActions({ onTemplatesDeleted: view.unselectItemsAndRefresh });

  return (
    <PageTable<JobTemplate | WorkflowJobTemplate>
      id="awx-job-templates-table"
      toolbarFilters={toolbarFilters}
      toolbarActions={toolbarActions}
      tableColumns={tableColumns}
      rowActions={rowActions}
      errorStateTitle={t('Error loading templates')}
      emptyStateTitle={t('No templates yet')}
      emptyStateDescription={t('To get started, create a template.')}
      emptyStateButtonText={t('Create template')}
      emptyStateButtonClick={() => pageNavigate(AwxRoute.CreateJobTemplate)}
      {...view}
      defaultSubtitle={t('Template')}
    />
  );
}
