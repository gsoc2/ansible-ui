import { ButtonVariant } from '@patternfly/react-core';
import {
  PencilAltIcon,
  MinusCircleIcon,
  PlusCircleIcon,
  PlusIcon,
  TrashIcon,
} from '@patternfly/react-icons';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  IPageAction,
  ITableColumn,
  IToolbarFilter,
  PageActionSelection,
  PageActionType,
  PageHeader,
  PageLayout,
  PageTable,
  useGetPageUrl,
  usePageNavigate,
} from '../../../../framework';
import { usePersistentFilters } from '../../../common/PersistentFilters';
import {
  useCreatedColumn,
  useDescriptionColumn,
  useIdColumn,
  useModifiedColumn,
  useNameColumn,
} from '../../../common/columns';
import { AwxRoute } from '../../AwxRoutes';
import {
  useCreatedByToolbarFilter,
  useDescriptionToolbarFilter,
  useModifiedByToolbarFilter,
  useNameToolbarFilter,
} from '../../common/awx-toolbar-filters';
import { useAwxConfig } from '../../common/useAwxConfig';
import getDocsBaseUrl from '../../common/util/getDocsBaseUrl';
import { Organization } from '../../interfaces/Organization';
import { awxAPI } from '../../api/awx-utils';
import { useAwxView } from '../../useAwxView';
import { useSelectUsersAddOrganizations } from '../users/hooks/useSelectUsersAddOrganizations';
import { useSelectUsersRemoveOrganizations } from '../users/hooks/useSelectUsersRemoveOrganizations';
import { useDeleteOrganizations } from './hooks/useDeleteOrganizations';

export function Organizations() {
  const { t } = useTranslation();
  const product: string = process.env.PRODUCT ?? t('AWX');
  const pageNavigate = usePageNavigate();
  const getPageUrl = useGetPageUrl();
  usePersistentFilters('organizations');
  const config = useAwxConfig();

  const toolbarFilters = useOrganizationsFilters();

  const tableColumns = useOrganizationsColumns();

  const view = useAwxView<Organization>({
    url: awxAPI`/organizations/`,
    toolbarFilters,
    tableColumns,
  });

  const deleteOrganizations = useDeleteOrganizations(view.unselectItemsAndRefresh);

  const selectUsersAddOrganizations = useSelectUsersAddOrganizations();
  const selectUsersRemoveOrganizations = useSelectUsersRemoveOrganizations();

  const toolbarActions = useMemo<IPageAction<Organization>[]>(
    () => [
      {
        type: PageActionType.Link,
        selection: PageActionSelection.None,
        isPinned: true,
        variant: ButtonVariant.primary,
        icon: PlusIcon,
        label: t('Create organization'),
        href: getPageUrl(AwxRoute.CreateOrganization),
      },
      { type: PageActionType.Seperator },
      {
        type: PageActionType.Button,
        selection: PageActionSelection.Multiple,
        icon: PlusCircleIcon,
        label: t('Add users to selected organizations'),
        onClick: () => selectUsersAddOrganizations(view.selectedItems),
      },
      {
        type: PageActionType.Button,
        selection: PageActionSelection.Multiple,
        icon: MinusCircleIcon,
        label: t('Remove users from selected organizations'),
        onClick: () => selectUsersRemoveOrganizations(view.selectedItems),
      },
      { type: PageActionType.Seperator },
      {
        type: PageActionType.Button,
        selection: PageActionSelection.Multiple,
        icon: TrashIcon,
        label: t('Delete selected organizations'),
        onClick: deleteOrganizations,
        isDanger: true,
      },
    ],
    [
      t,
      getPageUrl,
      deleteOrganizations,
      selectUsersAddOrganizations,
      view.selectedItems,
      selectUsersRemoveOrganizations,
    ]
  );

  const rowActions = useMemo<IPageAction<Organization>[]>(() => {
    const actions: IPageAction<Organization>[] = [
      {
        type: PageActionType.Link,
        selection: PageActionSelection.Single,
        isPinned: true,
        icon: PencilAltIcon,
        label: t('Edit organization'),
        href: (organization) => {
          return getPageUrl(AwxRoute.EditOrganization, { params: { id: organization.id } });
        },
      },
      { type: PageActionType.Seperator },
      {
        type: PageActionType.Button,
        selection: PageActionSelection.Single,
        icon: PlusCircleIcon,
        label: t('Add users to organization'),
        onClick: (organization) => selectUsersAddOrganizations([organization]),
      },
      {
        type: PageActionType.Button,
        selection: PageActionSelection.Single,
        icon: MinusCircleIcon,
        label: t('Remove users from organization'),
        onClick: (organization) => selectUsersRemoveOrganizations([organization]),
      },
      { type: PageActionType.Seperator },
      {
        type: PageActionType.Button,
        selection: PageActionSelection.Single,
        icon: TrashIcon,
        label: t('Delete organization'),
        onClick: (organization) => deleteOrganizations([organization]),
        isDanger: true,
      },
    ];
    return actions;
  }, [
    t,
    getPageUrl,
    selectUsersAddOrganizations,
    selectUsersRemoveOrganizations,
    deleteOrganizations,
  ]);

  return (
    <PageLayout>
      <PageHeader
        title={t('Organizations')}
        titleHelpTitle={t('Organization')}
        titleHelp={t(
          `An Organization is a logical collection of Users, Teams, Projects, and Inventories, and is the highest level in the {{product}} object hierarchy.`,
          { product }
        )}
        titleDocLink={`${getDocsBaseUrl(config)}/html/userguide/organizations.html`}
        description={t(
          `An Organization is a logical collection of Users, Teams, Projects, and Inventories, and is the highest level in the {{product}} object hierarchy.`,
          { product }
        )}
      />
      <PageTable<Organization>
        id="awx-organizations-table"
        toolbarFilters={toolbarFilters}
        toolbarActions={toolbarActions}
        tableColumns={tableColumns}
        rowActions={rowActions}
        errorStateTitle={t('Error loading organizations')}
        emptyStateTitle={t('No organizations yet')}
        emptyStateDescription={t('To get started, create an organization.')}
        emptyStateButtonText={t('Create organization')}
        emptyStateButtonClick={() => pageNavigate(AwxRoute.CreateOrganization)}
        {...view}
        defaultSubtitle={t('Organization')}
      />
    </PageLayout>
  );
}

export function useOrganizationsFilters() {
  const nameToolbarFilter = useNameToolbarFilter();
  const descriptionToolbarFilter = useDescriptionToolbarFilter();
  const createdByToolbarFilter = useCreatedByToolbarFilter();
  const modifiedByToolbarFilter = useModifiedByToolbarFilter();
  const toolbarFilters = useMemo<IToolbarFilter[]>(
    () => [
      nameToolbarFilter,
      descriptionToolbarFilter,
      createdByToolbarFilter,
      modifiedByToolbarFilter,
    ],
    [nameToolbarFilter, descriptionToolbarFilter, createdByToolbarFilter, modifiedByToolbarFilter]
  );
  return toolbarFilters;
}

export function useOrganizationsColumns(options?: {
  disableSort?: boolean;
  disableLinks?: boolean;
}) {
  const { t } = useTranslation();
  const pageNavigate = usePageNavigate();
  const idColumn = useIdColumn();
  const nameClick = useCallback(
    (organization: Organization) =>
      pageNavigate(AwxRoute.OrganizationDetails, { params: { id: organization.id } }),
    [pageNavigate]
  );
  const descriptionColumn = useDescriptionColumn();
  const nameColumn = useNameColumn({
    ...options,
    onClick: nameClick,
  });
  const createdColumn = useCreatedColumn(options);
  const modifiedColumn = useModifiedColumn(options);
  const tableColumns = useMemo<ITableColumn<Organization>[]>(
    () => [
      idColumn,
      nameColumn,
      descriptionColumn,
      {
        header: t('Members'),
        type: 'count',
        value: (organization) => organization.summary_fields?.related_field_counts?.users,
      },
      {
        header: t('Teams'),
        type: 'count',
        value: (organization) => organization.summary_fields?.related_field_counts?.teams,
      },
      createdColumn,
      modifiedColumn,
    ],
    [idColumn, nameColumn, descriptionColumn, t, createdColumn, modifiedColumn]
  );
  return tableColumns;
}
