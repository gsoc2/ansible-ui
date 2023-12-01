import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ITableColumn, IToolbarFilter, TextCell, ToolbarFilterType } from '../../../../framework';
import { CollectionVersionSearch } from '../Collection';

import {
  useAsyncSingleSelectFilterBuilder,
  useAsyncMultiSelectFilterBuilder,
  AsyncSelectFilterBuilderProps,
} from '../../../../framework/PageToolbar/PageToolbarFilters/ToolbarAsyncSelectFilterBuilder';
import { useHubView } from '../../useHubView';
import { hubAPI } from '../../api/formatPath';

function useParameters(): AsyncSelectFilterBuilderProps<CollectionVersionSearch> {
  const tableColumns = useCollectionVersionColumns();
  const toolbarFilters = useCollectionVersionFilters();
  const { t } = useTranslation();

  return {
    title: t`Select Collection Version`,
    tableColumns,
    toolbarFilters,
    useView: useHubView,
    viewParams: {
      url: hubAPI`/v3/plugin/ansible/search/collection-versions`,
      toolbarFilters,
      tableColumns,
      disableQueryString: true,
      keyFn: (item) =>
        item?.collection_version?.name +
        '_' +
        item?.collection_version?.namespace +
        '_' +
        item?.repository?.name,
    },
  };
}

export function useSelectCollectionVersionMulti() {
  const params = useParameters();

  return useAsyncMultiSelectFilterBuilder<CollectionVersionSearch>(params);
}

export function useSelectCollectionVersionSingle() {
  const params = useParameters();

  return useAsyncSingleSelectFilterBuilder<CollectionVersionSearch>(params);
}

export function useCollectionVersionColumns(_options?: {
  disableSort?: boolean;
  disableLinks?: boolean;
}) {
  const { t } = useTranslation();
  return useMemo<ITableColumn<CollectionVersionSearch>[]>(
    () => [
      {
        header: t('Version'),
        value: (item) => item.collection_version?.version,
        cell: (item) => <TextCell text={item.collection_version?.version} />,
      },

      {
        header: t('Description'),
        type: 'description',
        value: (item) => item.collection_version?.description,
      },
    ],
    [t]
  );
}

export function useCollectionVersionFilters() {
  const { t } = useTranslation();

  return useMemo<IToolbarFilter[]>(
    () => [
      {
        key: 'keywords',
        label: t('version'),
        type: ToolbarFilterType.Text,
        query: 'version',
        comparison: 'equals',
      },
    ],
    [t]
  );
}
