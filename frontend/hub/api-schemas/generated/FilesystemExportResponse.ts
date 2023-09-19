// Autogenerated file. Please do not modify.

// If you want to modify fields to interface, create new one in the folder above and create interface with the same name.
// You can then add, modify or even delete existing interface fields. Delete is done with Omit, note however it returns new interface.
// Those autogenerated interfaces does not contains all types, some of them are unknown - those are candidates for custom modification.
// See readme in folder above for more information.

/* eslint-disable @typescript-eslint/no-empty-interface */

// URL of interface:
// /api/pulp/api/v3/exporters/core/filesystem/{exporter_pk}/exports/{pulp_id}/

// Serializer for FilesystemExports.
export interface FilesystemExportResponse {
  pulp_href: string;

  // Timestamp of creation.
  pulp_created: string;

  // A URI of the task that ran the Export.
  task: string;

  // Resources that were exported.
  // exported_resources				:	unknown;

  // Any additional parameters that were used to create the export.
  // params				:	unknown;
}
