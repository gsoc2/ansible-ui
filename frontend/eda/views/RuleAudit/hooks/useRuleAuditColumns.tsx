import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ColumnModalOption,
  ITableColumn,
  LabelsCell,
  TextCell,
  useGetPageUrl,
} from '../../../../../framework';
import { formatDateString } from '../../../../../framework/utils/formatDateString';
import { StatusCell } from '../../../../common/Status';
import { EdaRoute } from '../../../EdaRoutes';
import { EdaRuleAuditItem } from '../../../interfaces/EdaRuleAudit';

export function useRuleAuditColumns() {
  const { t } = useTranslation();
  const getPageUrl = useGetPageUrl();
  return useMemo<ITableColumn<EdaRuleAuditItem>[]>(
    () => [
      {
        header: t('Name'),
        cell: (ruleAudit) => (
          <TextCell
            text={ruleAudit?.name}
            to={getPageUrl(EdaRoute.RuleAuditPage, { params: { id: ruleAudit?.id } })}
          />
        ),
        card: 'name',
        list: 'name',
      },
      {
        header: t('Status'),
        cell: (ruleAudit) => <StatusCell status={ruleAudit?.status} />,
        card: 'name',
        list: 'name',
      },
      {
        header: t('Rulebook activation'),
        cell: (ruleAudit) =>
          ruleAudit?.activation_instance?.id ? (
            <TextCell
              text={ruleAudit?.activation_instance?.name || ''}
              to={getPageUrl(EdaRoute.RulebookActivationInstancePage, {
                params: { id: ruleAudit?.id, instanceId: ruleAudit?.activation_instance?.id },
              })}
            />
          ) : (
            <LabelsCell
              labels={[
                ruleAudit?.activation_instance?.name === 'DELETED' ? t('Deleted') : t('Unknown'),
              ]}
            />
          ),
        modal: ColumnModalOption.Hidden,
      },
      {
        header: t('Fired date'),
        cell: (ruleAudit) => (
          <TextCell
            text={ruleAudit?.fired_at ? formatDateString(new Date(ruleAudit.fired_at)) : ''}
          />
        ),
      },
    ],
    [getPageUrl, t]
  );
}
