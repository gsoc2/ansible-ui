import { Label, LabelGroup } from '@patternfly/react-core';
import { Link } from 'react-router-dom';

type LabelWithLink = { name: string; link: string };

type LabelsWithLinksProps = {
  labels?: never;
  labelsWithLinks: LabelWithLink[];
  numLabels?: number;
};

type LabelsProps = {
  labels: string[];
  labelsWithLinks?: never;
  numLabels?: number;
};

export function LabelsCell(props: LabelsProps | LabelsWithLinksProps) {
  return (
    <LabelGroup numLabels={props.numLabels ?? 999} style={{ flexWrap: 'nowrap' }}>
      {props.labels
        ? props.labels.map((label) => <Label key={label}>{label}</Label>)
        : props.labelsWithLinks.map((labelWithLink) => (
            <Label color="blue" key={labelWithLink.name}>
              <Link to={labelWithLink.link}>{labelWithLink.name}</Link>
            </Label>
          ))}
    </LabelGroup>
  );
}
