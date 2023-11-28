import { randomString } from '../../../../framework/utils/random-string';
import { Project } from '../../../../frontend/awx/interfaces/Project';
import { Inventory } from '../../../../frontend/awx/interfaces/Inventory';
import { Organization } from '../../../../frontend/awx/interfaces/Organization';
import { WorkflowJobTemplateNode } from '../../../../frontend/awx/interfaces/generated-from-swagger/api';
import { InventorySource } from '../../../../frontend/awx/interfaces/InventorySource';

describe('Workflow Job templates visualizer', function () {
  let organization: Organization;
  let project: Project;
  let inventory: Inventory;
  let inventorySource: InventorySource;

  before(function () {
    cy.awxLogin();
    cy.createAwxInventory({ organization: (this.globalProjectOrg as Organization).id }).then(
      (i) => {
        inventory = i;
      }
    );
  });
  afterEach(() => {
    // cy.deleteAwxInventory(inventory, { failOnStatusCode: false });
    // cy.deleteAwxOrganization(organization, { failOnStatusCode: false });
  });

  it('successNode with project and job template', function () {
    cy.createAwxWorkflowJobTemplate({
      organization: (this.globalProjectOrg as Organization).id,
      inventory: inventory.id,
    }).then((workflowJobTemplate) => {
      cy.log('WJT', workflowJobTemplate);
      cy.createAwxWorkflowVisualizerProjectNode(
        workflowJobTemplate,
        this.globalProject as Project
      ).then((workflowNodeResults) => {
        cy.createWorkflowJTSuccessNodeLink(workflowNodeResults);
      });
      // cy.createAwxWorkflowVisualizerWJTNode(workflowJobTemplate).then((workflowNodeResults) => {
      //   cy.createWorkflowJTSuccessNodeLink(workflowNodeResults);
      // });
      cy.visit(
        `/ui_next/resources/templates/workflow_job_template/${workflowJobTemplate?.id}/visualizer`
      );
    });
  });

  // it.only('successNode with 2 nodes', function () {
  //   cy.createAwxWorkflowJobTemplate({
  //     organization: (this.globalProjectOrg as Organization).id,
  //     inventory: inventory.id,
  //   }).then((workflowJobTemplate) => {
  //     cy.log('#1 WORKFLOW JOB TEMPLATE 🚨', workflowJobTemplate);
  //     cy.createAwxWorkflowVisualizerProjectNode(
  //       workflowJobTemplate,
  //       this.globalProject as Project
  //     ).then((ProjectNodeId) => {
  //       cy.log('#2 PROJECT NODE ID 🚨', ProjectNodeId);
  //       //cy.createAwxWorkflowVisualizerManagementNode(workflowJobTemplate, 1).then((res) => {
  //       //cy.log('#3 MANAGEMENT NODE ID 🚨', res);
  //       const Task = (workflowJobTemplate, 1): Cypress.Chainable<number> => {
  //         return cy.createAwxWorkflowVisualizerManagementNode(workflowJobTemplate, 1);
  //       };
  //       cy.createWorkflowJTSuccessNodeLink(ProjectNodeId, Task);
  //     });
  //     // cy.createAwxWorkflowVisualizerManagementNode(workflowJobTemplate, 1).then((res) => {
  //     //   cy.log(res);
  //     // });
  //     cy.visit(
  //       `/ui_next/resources/templates/workflow_job_template/${workflowJobTemplate?.id}/visualizer`
  //     );
  //     cy.contains('Workflow Visualizer').should('be.visible');
  //   });
  // });

  it.only('successNode with project', function () {
    cy.createAwxWorkflowJobTemplate({
      organization: (this.globalProjectOrg as Organization).id,
      inventory: inventory.id,
    }).then((workflowJobTemplate) => {
      cy.log('#1 WORKFLOW JOB TEMPLATE 🚨', workflowJobTemplate);
      cy.createAwxWorkflowVisualizerProjectNode(
        workflowJobTemplate,
        this.globalProject as Project
      ).then((ProjectNodeId) => {
        cy.log('#2 PROJECT NODE ID 🚨', ProjectNodeId);
        cy.createAwxWorkflowVisualizerManagementNode(workflowJobTemplate, 1).then((res) => {
          cy.log('#3 MANAGEMENT NODE ID 🚨', res);
          cy.createWorkflowJTSuccessNodeLink(ProjectNodeId, res);
        });
        // cy.createAwxWorkflowVisualizerProjectNode(
        //   workflowJobTemplate,
        //   this.globalProject as Project
        // ).then((ProjectNodeId2) => {
        //   cy.createWorkflowJTSuccessNodeLink(ProjectNodeId, ProjectNodeId2);
        // });
      });
      cy.visit(
        `/ui_next/resources/templates/workflow_job_template/${workflowJobTemplate?.id}/visualizer`
      );
      cy.contains('Workflow Visualizer').should('be.visible');
    });
  });

  it('with CC post a job template node to a workflow job template', function () {
    cy.createAwxJobTemplate({
      organization: (this.globalProjectOrg as Organization).id,
      project: (this.globalProject as Project).id,
      inventory: inventory.id,
    }).then((jobTemplate) => {
      cy.createAwxWorkflowJobTemplate({
        organization: (this.globalProjectOrg as Organization).id,
        inventory: inventory.id,
      }).then((workflowJobTemplate) => {
        cy.createAwxWorkflowVisualizerJobTemplateNode(workflowJobTemplate, jobTemplate.id).then(
          (response) => {
            cy.wrap(response)
              .its('url')
              .should('eq', `/api/v2/workflow_job_template_nodes/${response.id}/`);
          }
        );
        cy.visit(
          `/ui_next/resources/templates/workflow_job_template/${workflowJobTemplate?.id}/visualizer`
        );
        cy.contains('Workflow Visualizer').should('be.visible');
        cy.contains(`${jobTemplate.name}`);
      });
    });
  });

  it('post a job template node to a workflow job template', function () {
    cy.createAwxJobTemplate({
      organization: (this.globalProjectOrg as Organization).id,
      project: (this.globalProject as Project).id,
      inventory: inventory.id,
    }).then((jobTemplate) => {
      cy.createAwxWorkflowJobTemplate({
        organization: (this.globalProjectOrg as Organization).id,
        inventory: inventory.id,
      }).then((workflowJobTemplate) => {
        cy.requestPost<WorkflowJobTemplateNode>(
          `/api/v2/workflow_job_templates/${workflowJobTemplate?.id}/workflow_nodes/`,
          {
            unified_job_template: jobTemplate?.id,
          }
        ).then((response) => {
          cy.wrap(response)
            .its('url')
            .should('eq', `/api/v2/workflow_job_template_nodes/${response.id}/`);
        });
        cy.visit(
          `/ui_next/resources/templates/workflow_job_template/${workflowJobTemplate?.id}/visualizer`
        );
        cy.contains('Workflow Visualizer').should('be.visible');
        cy.contains(`${jobTemplate.name}`);
      });
    });
  });

  it('post a job template and project node to a workflow job template', function () {
    cy.createAwxJobTemplate({
      organization: (this.globalProjectOrg as Organization).id,
      project: (this.globalProject as Project).id,
      inventory: inventory.id,
    }).then((jobTemplate) => {
      cy.createAwxWorkflowJobTemplate({
        organization: (this.globalProjectOrg as Organization).id,
        inventory: inventory.id,
      }).then((workflowJobTemplate) => {
        cy.requestPost<WorkflowJobTemplateNode>(
          `/api/v2/workflow_job_templates/${workflowJobTemplate?.id}/workflow_nodes/`,
          {
            unified_job_template: jobTemplate?.id,
          }
        );
        cy.requestPost<WorkflowJobTemplateNode>(
          `/api/v2/workflow_job_templates/${workflowJobTemplate?.id}/workflow_nodes/`,
          {
            unified_job_template: (this?.globalProject as Project).id,
            scm_branch: null,
            limit: null,
            job_tags: null,
            skip_tags: null,
          }
        ).then((response) => {
          cy.wrap(response)
            .its('url')
            .should('eq', `/api/v2/workflow_job_template_nodes/${response.id}/`);
        });
        cy.visit(
          `/ui_next/resources/templates/workflow_job_template/${workflowJobTemplate?.id}/visualizer`
        );
        cy.contains('Workflow Visualizer').should('be.visible');
        cy.contains(`${jobTemplate.name}`);
        // cy.contains(`${(this?.globalProject as Project).name}`);
      });
    });
  });

  it('with CC post a project node to a workflow job template', function () {
    cy.createAwxWorkflowJobTemplate({
      organization: (this.globalProjectOrg as Organization).id,
      inventory: inventory.id,
    }).then((workflowJobTemplate) => {
      cy.createAwxWorkflowVisualizerProjectNode(
        workflowJobTemplate,
        this.globalProject as Project
      ).then((response) => {
        cy.wrap(response)
          .its('url')
          .should('eq', `/api/v2/workflow_job_template_nodes/${response.id}/`);
      });
      cy.visit(
        `/ui_next/resources/templates/workflow_job_template/${workflowJobTemplate?.id}/visualizer`
      );
      cy.contains('Workflow Visualizer').should('be.visible');
      //cy.contains(`${(this?.globalProject as Project).name}`);
    });
  });

  it('post a project node to a workflow job template', function () {
    cy.createAwxWorkflowJobTemplate({
      organization: (this.globalProjectOrg as Organization).id,
      inventory: inventory.id,
    }).then((workflowJobTemplate) => {
      cy.createAwxWorkflowVisualizerProjectNode(
        workflowJobTemplate,
        this.globalProject as Project
      ).then((response) => {
        cy.wrap(response)
          .its('url')
          .should('eq', `/api/v2/workflow_job_template_nodes/${response.id}/`);
      });
      cy.visit(
        `/ui_next/resources/templates/workflow_job_template/${workflowJobTemplate?.id}/visualizer`
      );
      cy.contains('Workflow Visualizer').should('be.visible');
      //cy.contains(`${(this?.globalProject as Project).name}`);
    });
  });

  it('with CC post a inventory source node to a workflow job template', function () {
    cy.createAwxOrganization().then((org) => {
      organization = org;
      cy.createAwxProject({ organization: organization.id }).then((p) => {
        project = p;
        cy.createAwxInventorySource(inventory, project).then((invSrc) => {
          inventorySource = invSrc;
          cy.createAwxWorkflowJobTemplate({
            organization: (this.globalProjectOrg as Organization).id,
            inventory: inventory.id,
          }).then((workflowJobTemplate) => {
            cy.createAwxWorkflowVisualizerInventorySourceNode(
              workflowJobTemplate,
              inventorySource
            ).then((response) => {
              cy.wrap(response)
                .its('url')
                .should('eq', `/api/v2/workflow_job_template_nodes/${response.id}/`);
            });
            cy.visit(
              `/ui_next/resources/templates/workflow_job_template/${workflowJobTemplate?.id}/visualizer`
            );
            cy.contains('Workflow Visualizer').should('be.visible');
            //cy.contains(`${inventorySource.name}`);
          });
        });
      });
    });
  });

  it('post a inventory source node to a workflow job template', function () {
    cy.createAwxOrganization().then((org) => {
      organization = org;
      cy.createAwxProject({ organization: organization.id }).then((p) => {
        project = p;
        cy.createAwxInventorySource(inventory, project).then((invSrc) => {
          inventorySource = invSrc;
          cy.createAwxWorkflowJobTemplate({
            organization: (this.globalProjectOrg as Organization).id,
            inventory: inventory.id,
          }).then((workflowJobTemplate) => {
            cy.requestPost<WorkflowJobTemplateNode>(
              `/api/v2/workflow_job_templates/${workflowJobTemplate?.id}/workflow_nodes/`,
              {
                unified_job_template: inventorySource.id,
                scm_branch: null,
                limit: null,
                job_tags: null,
                skip_tags: null,
              }
            ).then((response) => {
              cy.wrap(response)
                .its('url')
                .should('eq', `/api/v2/workflow_job_template_nodes/${response.id}/`);
            });
            cy.visit(
              `/ui_next/resources/templates/workflow_job_template/${workflowJobTemplate?.id}/visualizer`
            );
            cy.contains('Workflow Visualizer').should('be.visible');
            //cy.contains(`${inventorySource.name}`);
          });
        });
      });
    });
  });

  it('with CC post a WJT node to a workflow job template', function () {
    cy.createAwxWorkflowJobTemplate({
      organization: (this.globalProjectOrg as Organization).id,
      inventory: inventory.id,
    }).then((workflowJobTemplate) => {
      cy.createAwxWorkflowVisualizerWJTNode(workflowJobTemplate).then((response) => {
        cy.wrap(response)
          .its('url')
          .should('eq', `/api/v2/workflow_job_template_nodes/${response.id}/`);
      });
      cy.visit(
        `/ui_next/resources/templates/workflow_job_template/${workflowJobTemplate?.id}/visualizer`
      );
      cy.contains('Workflow Visualizer').should('be.visible');
      //cy.contains(`${inventorySource.name}`);
    });
  });

  it('with CC post a Management node to a workflow job template', function () {
    cy.createAwxWorkflowJobTemplate({
      organization: (this.globalProjectOrg as Organization).id,
      inventory: inventory.id,
    }).then((workflowJobTemplate) => {
      cy.createAwxWorkflowVisualizerManagementNode(workflowJobTemplate, 2).then((response) => {
        // cy.wrap(response)
        //   .its('url')
        //   .should('eq', `/api/v2/workflow_job_template_nodes/${response.id}/`);
      });
      cy.visit(
        `/ui_next/resources/templates/workflow_job_template/${workflowJobTemplate?.id}/visualizer`
      );
      cy.contains('Workflow Visualizer').should('be.visible');
      //cy.contains(`${inventorySource.name}`);
    });
  });

  it('should render a workflow visualizer view with multiple nodes present', function () {
    cy.createAwxWorkflowJobTemplate({
      organization: (this.globalProjectOrg as Organization).id,
      inventory: inventory.id,
    }).then((workflowJobTemplate) => {
      cy.renderWorkflowVisualizerNodesFromFixtureFile(
        `${workflowJobTemplate.name}`,
        'wf_vis_testing_A.json'
      );
      cy.get('[class*="66-node-label"]')
        .should('exist')
        .should('contain', 'Cleanup Activity Stream');
      cy.get('[class*="43-node-label"]').should('exist').should('contain', 'bar');
      cy.get('[class*="42-node-label"]').should('exist').should('contain', '1');
      cy.get('[class*="41-node-label"]').should('exist').should('contain', 'Demo Project');
      //cy.deleteAwxWorkflowJobTemplate(workflowJobTemplate);
    });
  });

  it('Should create a workflow job template and then navigate to the visualizer, and then navigate to the details view after clicking cancel', () => {
    const jtName = 'E2E ' + randomString(4);
    // Create workflow job template
    cy.navigateTo('awx', 'templates');
    cy.clickButton(/^Create template$/);
    cy.clickLink(/^Create workflow job template$/);
    cy.get('[data-cy="name"]').type(jtName);
    cy.get('[data-cy="description"]').type('this is a description');
    cy.get('[data-cy="Submit"]').click();

    cy.get('[data-cy="workflow-visualizer"]').should('be.visible');
    cy.get('h4.pf-v5-c-empty-state__title-text').should(
      'have.text',
      'There are currently no nodes in this workflow'
    );
    cy.get('div.pf-v5-c-empty-state__actions').within(() => {
      cy.get('[data-cy="add-node-button"]').should('be.visible');
    });

    cy.get('button[data-cy="workflow-visualizer-toolbar-close"]').click();

    // Clean up - delete workflow job template
    cy.clickPageAction(/^Delete template/);
    cy.get('#confirm').click();
    cy.clickButton(/^Delete template/);
    cy.verifyPageTitle('Template');
  });
});
