import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { CubesIcon } from '@patternfly/react-icons';
import { PageHeader, PageLayout, PageTable } from '../../../../framework';
import { useOptions } from '../../../common/crud/useOptions';
import { ActionsResponse, OptionsResponse } from '../../interfaces/OptionsResponse';
import { useAwxWebSocketSubscription } from '../../common/useAwxWebSocket';
import { RouteObj } from '../../../Routes';
import { Project } from '../../interfaces/Project';
import { useAwxView } from '../../useAwxView';
import { useProjectsFilters } from './hooks/useProjectsFilters';
import { useProjectsColumns } from './hooks/useProjectsColumns';
import { useProjectActions } from './hooks/useProjectActions';
import { useProjectToolbarActions } from './hooks/useProjectToolbarActions';

export function Projects() {
  const { t } = useTranslation();
  const product: string = process.env.PRODUCT ?? t('AWX');
  const navigate = useNavigate();
  const toolbarFilters = useProjectsFilters();
  const tableColumns = useProjectsColumns();
  const view = useAwxView<Project>({
    url: '/api/v2/projects/',
    toolbarFilters,
    tableColumns,
  });
  const toolbarActions = useProjectToolbarActions(view.unselectItemsAndRefresh);
  const rowActions = useProjectActions(view.unselectItemsAndRefresh);
  const { data } = useOptions<OptionsResponse<ActionsResponse>>('/api/v2/projects/');
  const canCreateProject = Boolean(data && data.actions && data.actions['POST']);
  const { refresh } = view;
  const handleWebSocketMessage = useCallback(
    (message?: { group_name?: string; type?: string }) => {
      switch (message?.group_name) {
        case 'jobs':
          switch (message?.type) {
            case 'job':
              void refresh();
              break;
            case 'workflow_job':
              void refresh();
              break;
            case 'project_update':
              void refresh();
              break;
          }
          break;
      }
    },
    [refresh]
  );
  useAwxWebSocketSubscription(
    { control: ['limit_reached_1'], jobs: ['status_changed'] },
    handleWebSocketMessage as (data: unknown) => void
  );

  return (
    <PageLayout>
      <PageHeader
        title={t('Projects')}
        titleHelpTitle={t('Projects')}
        titleHelp={t(
          `A Project is a logical collection of Ansible playbooks, represented in ${product}. You can manage playbooks and playbook directories by either placing them manually under the Project Base Path on your ${product} server, or by placing your playbooks into a source code management (SCM) system supported by ${product}, including Git, Subversion, Mercurial, and Red Hat Insights.`
        )}
        titleDocLink="https://docs.ansible.com/ansible-tower/latest/html/userguide/projects.html"
        description={t(
          `A Project is a logical collection of Ansible playbooks, represented in ${product}.`
        )}
      />
      <PageTable<Project>
        toolbarFilters={toolbarFilters}
        toolbarActions={toolbarActions}
        tableColumns={tableColumns}
        rowActions={rowActions}
        errorStateTitle={t('Error loading projects')}
        emptyStateTitle={
          canCreateProject
            ? t('There are currently no projects added to your organization.')
            : t('You do not have permission to create a project')
        }
        emptyStateDescription={
          canCreateProject
            ? t('Please create a project by using the button below.')
            : t(
                'Please contact your Organization Administrator if there is an issue with your access.'
              )
        }
        emptyStateIcon={canCreateProject ? undefined : CubesIcon}
        emptyStateButtonText={canCreateProject ? t('Create project') : undefined}
        emptyStateButtonClick={
          canCreateProject ? () => navigate(RouteObj.CreateProject) : undefined
        }
        {...view}
      />
    </PageLayout>
  );
}
