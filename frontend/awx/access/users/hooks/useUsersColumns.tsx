import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ITableColumn, TextCell, useGetPageUrl } from '../../../../../framework';
import { AwxRoute } from '../../../AwxRoutes';
import { useCreatedColumn } from '../../../../common/columns';
import { User } from '../../../interfaces/User';
import { UserType } from '../components/UserType';

export function useUsersColumns(options?: { disableLinks?: boolean; disableSort?: boolean }) {
  const { t } = useTranslation();
  const getPageUrl = useGetPageUrl();

  const createdColumn = useCreatedColumn(options);
  const tableColumns = useMemo<ITableColumn<User>[]>(
    () => [
      {
        header: t('Username'),
        cell: (user) => (
          <TextCell
            text={user.username}
            to={getPageUrl(AwxRoute.UserDetails, { params: { id: user.id.toString() } })}
          />
        ),
        card: 'name',
        list: 'name',
        sort: 'username',
        maxWidth: 200,
      },
      {
        header: t('User type'),
        cell: (user) => <UserType user={user} />,
        card: 'subtitle',
        list: 'subtitle',
      },
      {
        header: t('First name'),
        type: 'text',
        value: (user) => user.first_name,
        sort: 'first_name',
      },
      {
        header: t('Last name'),
        type: 'text',
        value: (user) => user.last_name,
        sort: 'last_name',
      },
      {
        header: t('Email'),
        type: 'text',
        value: (user) => user.email,
        sort: 'email',
      },
      {
        ...createdColumn,
        sort: undefined,
      },
    ],
    [createdColumn, getPageUrl, t]
  );
  return tableColumns;
}
