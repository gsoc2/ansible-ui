import { PlusCircleIcon } from '@patternfly/react-icons';
import { useTranslation } from 'react-i18next';
import {
  PageTable,
  useColumnsWithoutExpandedRow,
  useColumnsWithoutSort,
  useGetPageUrl,
  useVisibleModalColumns,
} from '../../../../framework';
import { PageDashboardCard } from '../../../../framework/PageDashboard/PageDashboardCard';
import { EdaRoute } from '../../EdaRoutes';
import { EdaRuleAuditItem } from '../../interfaces/EdaRuleAudit';
import { IEdaView } from '../../useEventDrivenView';
import { useRuleAuditColumns } from '../../views/RuleAudit/hooks/useRuleAuditColumns';

export function EdaRuleAuditCard(props: { view: IEdaView<EdaRuleAuditItem> }) {
  const { view } = props;
  const { t } = useTranslation();
  const getPageUrl = useGetPageUrl();
  const tableColumns = useRuleAuditColumns();
  let columns = useVisibleModalColumns(tableColumns);
  columns = useColumnsWithoutSort(columns);
  columns = useColumnsWithoutExpandedRow(columns);
  return (
    <PageDashboardCard
      id="recent-rule-audits"
      title={t('Rule Audit')}
      subtitle={t('Recently fired rules')}
      height="md"
      linkText={t('Go to Rule Audit')}
      to={getPageUrl(EdaRoute.RuleAudits)}
      helpTitle={t('Rule audit')}
      help={t('Rule audit allows auditing of rules which have been triggered by incoming events.')}
    >
      <PageTable
        disableBodyPadding={true}
        tableColumns={columns}
        autoHidePagination={true}
        errorStateTitle={t('Error loading rule audit records')}
        emptyStateIcon={PlusCircleIcon}
        emptyStateButtonIcon={<PlusCircleIcon />}
        emptyStateVariant={'light'}
        emptyStateTitle={t('There are currently no rule audit records')}
        {...view}
        compact
        itemCount={view.itemCount !== undefined ? Math.min(view.itemCount, 7) : undefined}
        pageItems={view.pageItems ? view.pageItems.slice(0, 7) : undefined}
        disableLastRowBorder
      />
    </PageDashboardCard>
  );
}
