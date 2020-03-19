---
layout: default
description: Description of the gRPC interface to control ArangoDB Oasis managed service
title: Oasis API Protocol Documentation
---
# Protocol Documentation
<a name="top"></a>


<a name="resourcemanager/v1/resourcemanager.proto"></a>
<p align="right"><a href="#top">Top</a></p>

## resourcemanager/v1/resourcemanager.proto



<a name="arangodb.cloud.resourcemanager.v1.DataProcessingAddendum"></a>

### DataProcessingAddendum



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [string](#string) |  | Identifier of this version of the DPA |
| content | [string](#string) |  | Content of DPA in markdown format |
| created_at | [google.protobuf.Timestamp](#google.protobuf.Timestamp) |  | Creation date of this version of the DPA. |






<a name="arangodb.cloud.resourcemanager.v1.Event"></a>

### Event
An Event represents something that happened to an organization
in the ArangoDB Managed service.


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [string](#string) |  | System identifier of the event. This is a read-only value. |
| url | [string](#string) |  | URL of this resource This is a read-only value and cannot be initialized. |
| organization_id | [string](#string) |  | Identifier of the organization that owns this event. This is a read-only value. |
| subject_id | [string](#string) |  | Identifier of the subject of this event. This is a read-only value. If the subject of this event is an organization, this value is a duplicate of organization_id. |
| type | [string](#string) |  | Type of the event. |
| payload | [Event.PayloadEntry](#arangodb.cloud.resourcemanager.v1.Event.PayloadEntry) | repeated | Payload of the event. The fields used in the payload are specific to the type of event. |
| created_at | [google.protobuf.Timestamp](#google.protobuf.Timestamp) |  | The creation timestamp of the event |
| subject_url | [string](#string) |  | URL of the subject of this event. This is a read-only value. |
| volatile | [bool](#bool) |  | If set, this event is not persisted. This is a read-only value. |






<a name="arangodb.cloud.resourcemanager.v1.Event.PayloadEntry"></a>

### Event.PayloadEntry



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| key | [string](#string) |  |  |
| value | [string](#string) |  |  |






<a name="arangodb.cloud.resourcemanager.v1.EventList"></a>

### EventList
List of Events.


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| items | [Event](#arangodb.cloud.resourcemanager.v1.Event) | repeated |  |






<a name="arangodb.cloud.resourcemanager.v1.IsMemberOfOrganizationRequest"></a>

### IsMemberOfOrganizationRequest
Request arguments for IsMemberOfOrganization.


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| user_id | [string](#string) |  | Identifier of the user |
| organization_id | [string](#string) |  | Identifier of the organization |






<a name="arangodb.cloud.resourcemanager.v1.IsMemberOfOrganizationResponse"></a>

### IsMemberOfOrganizationResponse
Response for IsMemberOfOrganization.


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| member | [bool](#bool) |  | Set if the requested user is a member of the requested organization. |
| owner | [bool](#bool) |  | Set if the requested user is an owner of the requested organization. |






<a name="arangodb.cloud.resourcemanager.v1.ListEventOptions"></a>

### ListEventOptions
Options for ListEvents


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| options | [arangodb.cloud.common.v1.ListOptions](#arangodb.cloud.common.v1.ListOptions) |  | Standard list options |
| subject_ids | [string](#string) | repeated | If set, filter on the subject_id of event |
| types | [string](#string) | repeated | If set, filter on the type of event |
| created_after | [google.protobuf.Timestamp](#google.protobuf.Timestamp) |  | If set, filter of events created after this timestamp |
| created_before | [google.protobuf.Timestamp](#google.protobuf.Timestamp) |  | If set, filter of events created before this timestamp |






<a name="arangodb.cloud.resourcemanager.v1.ListQuotasRequest"></a>

### ListQuotasRequest
Request arguments for ListXyzQuotas


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| options | [arangodb.cloud.common.v1.ListOptions](#arangodb.cloud.common.v1.ListOptions) |  | Common list options |
| kinds | [string](#string) | repeated | If set, limit the returned list of quota&#39;s to these kinds. |






<a name="arangodb.cloud.resourcemanager.v1.Member"></a>

### Member
Member of an organization.
A member is always a user.


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| user_id | [string](#string) |  | Identifier of the user |
| owner | [bool](#bool) |  | Set if this user is owner of the organization |






<a name="arangodb.cloud.resourcemanager.v1.MemberList"></a>

### MemberList
List of Members.


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| items | [Member](#arangodb.cloud.resourcemanager.v1.Member) | repeated |  |






<a name="arangodb.cloud.resourcemanager.v1.Organization"></a>

### Organization
An Organization is represents a real world organization such as a company.


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [string](#string) |  | System identifier of the organization. This is a read-only value. |
| url | [string](#string) |  | URL of this resource This is a read-only value and cannot be initialized. |
| name | [string](#string) |  | Name of the organization |
| description | [string](#string) |  | Description of the organization |
| is_deleted | [bool](#bool) |  | Set when this organization is deleted. This is a read-only value. |
| created_at | [google.protobuf.Timestamp](#google.protobuf.Timestamp) |  | The creation timestamp of the organization |
| deleted_at | [google.protobuf.Timestamp](#google.protobuf.Timestamp) |  | The deletion timestamp of the organization |
| tier | [Tier](#arangodb.cloud.resourcemanager.v1.Tier) |  | Tier used for this organization. This is a read-only value and cannot be initialized. |
| total_deployments | [Organization.TotalDeploymentsEntry](#arangodb.cloud.resourcemanager.v1.Organization.TotalDeploymentsEntry) | repeated | Total number of deployments created in this organization throughout its entire lifetime per tier-id. map: tier-id -&gt; count This is a read-only value. |
| is_flexible_deployments_enabled | [bool](#bool) |  | If set, all projects in this organization are allowed to use deployments using the flexible model. |
| is_allowed_to_use_custom_images | [bool](#bool) |  | If set, this organization is allowed to use custom images for ArangoDB deployments. |






<a name="arangodb.cloud.resourcemanager.v1.Organization.TotalDeploymentsEntry"></a>

### Organization.TotalDeploymentsEntry



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| key | [string](#string) |  |  |
| value | [int32](#int32) |  |  |






<a name="arangodb.cloud.resourcemanager.v1.OrganizationInvite"></a>

### OrganizationInvite
An OrganizationInvite represents an invite for a human to join an
organization.


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [string](#string) |  | System identifier of the invite. This is a read-only value. |
| url | [string](#string) |  | URL of this resource This is a read-only value and cannot be initialized. |
| organization_id | [string](#string) |  | Identifier of the organization that the human is invited to join. This is a read-only value. |
| email | [string](#string) |  | Email address of the human who is invited. |
| accepted | [bool](#bool) |  | If set, the invitee accepted the invite. This is a read-only value. |
| rejected | [bool](#bool) |  | If set, the invitee rejected the invite. This is a read-only value. |
| created_at | [google.protobuf.Timestamp](#google.protobuf.Timestamp) |  | The creation timestamp of the invite This is a read-only value. |
| accepted_at | [google.protobuf.Timestamp](#google.protobuf.Timestamp) |  | The acceptance timestamp of the invite This is a read-only value. |
| rejected_at | [google.protobuf.Timestamp](#google.protobuf.Timestamp) |  | The rejection timestamp of the invite This is a read-only value. |
| user_id | [string](#string) |  | Identifier of the user that accepted or rejected this invite. This is a read-only value. |
| created_by_id | [string](#string) |  | Identifier of the user that created this invite. |
| organization_name | [string](#string) |  | Identifier of the organization that the human is invited to join. This is a read-only value. |
| created_by_name | [string](#string) |  | Name of the user that created this invite. This is a read-only value. |






<a name="arangodb.cloud.resourcemanager.v1.OrganizationInviteList"></a>

### OrganizationInviteList
List of OrganizationInvites.


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| items | [OrganizationInvite](#arangodb.cloud.resourcemanager.v1.OrganizationInvite) | repeated |  |






<a name="arangodb.cloud.resourcemanager.v1.OrganizationList"></a>

### OrganizationList
List of organizations.


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| items | [Organization](#arangodb.cloud.resourcemanager.v1.Organization) | repeated | Actual organizations |
| budget | [arangodb.cloud.common.v1.Budget](#arangodb.cloud.common.v1.Budget) |  | Budget for organizations (owned by the caller) |






<a name="arangodb.cloud.resourcemanager.v1.OrganizationMembersRequest"></a>

### OrganizationMembersRequest
Request arguments for Add/DeleteOrganizationMembers.


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| organization_id | [string](#string) |  | Identifier of the organization to add/remove a user from |
| members | [MemberList](#arangodb.cloud.resourcemanager.v1.MemberList) |  | Users to add/remove. For every user, an owner flag is provided as well. If you add an existing user, the owner flag or the add request will overwrite the value of the existing owner flag. |






<a name="arangodb.cloud.resourcemanager.v1.Project"></a>

### Project
A Project is represents a unit within an organization such as a department.


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [string](#string) |  | System identifier of the project. This is a read-only value. It can be set when creating the project. |
| url | [string](#string) |  | URL of this resource This is a read-only value and cannot be initialized. |
| name | [string](#string) |  | Name of the project |
| description | [string](#string) |  | Description of the project |
| organization_id | [string](#string) |  | Identifier of the organization that owns this project. This is a read-only value. |
| is_deleted | [bool](#bool) |  | Set when this project is deleted |
| created_at | [google.protobuf.Timestamp](#google.protobuf.Timestamp) |  | The creation timestamp of the project |
| deleted_at | [google.protobuf.Timestamp](#google.protobuf.Timestamp) |  | The deletion timestamp of the project |
| is_flexible_deployments_enabled | [bool](#bool) |  | If set, this project is allowed to use deployments using the flexible model. |






<a name="arangodb.cloud.resourcemanager.v1.ProjectList"></a>

### ProjectList
List of Projects.


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| items | [Project](#arangodb.cloud.resourcemanager.v1.Project) | repeated | Resulting projects |
| budget | [arangodb.cloud.common.v1.Budget](#arangodb.cloud.common.v1.Budget) |  | Budget for projects |






<a name="arangodb.cloud.resourcemanager.v1.Quota"></a>

### Quota
Quota limit


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| kind | [string](#string) |  | Kind of quota |
| description | [string](#string) |  | Human readable description of the quota |
| limit | [int64](#int64) |  | Current limit of the quota. A value of 0 means unlimited. |






<a name="arangodb.cloud.resourcemanager.v1.QuotaDescription"></a>

### QuotaDescription
Description of a kind of quota&#39;s


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| kind | [string](#string) |  | Kind of the quota |
| description | [string](#string) |  | Human readable description |
| for_organizations | [bool](#bool) |  | If set, this kind of quota is valid at organization level |
| for_projects | [bool](#bool) |  | If set, this kind of quota is valid at project level |






<a name="arangodb.cloud.resourcemanager.v1.QuotaDescriptionList"></a>

### QuotaDescriptionList
List of QuotaDescription&#39;s


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| items | [QuotaDescription](#arangodb.cloud.resourcemanager.v1.QuotaDescription) | repeated |  |






<a name="arangodb.cloud.resourcemanager.v1.QuotaList"></a>

### QuotaList
List of Quota&#39;s


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| items | [Quota](#arangodb.cloud.resourcemanager.v1.Quota) | repeated |  |






<a name="arangodb.cloud.resourcemanager.v1.TermsAndConditions"></a>

### TermsAndConditions



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [string](#string) |  | Identifier of this version of the terms &amp; conditions |
| content | [string](#string) |  | Content of terms &amp; conditions in markdown format |
| created_at | [google.protobuf.Timestamp](#google.protobuf.Timestamp) |  | Creation date of this version of the terms &amp; conditions. |






<a name="arangodb.cloud.resourcemanager.v1.Tier"></a>

### Tier
Tier of an organization.


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [string](#string) |  | Identifier of the tier. This is a read-only value and cannot be initialized. |
| name | [string](#string) |  | Human readable name of the tier. This is a read-only value and cannot be initialized. |
| has_support_plans | [bool](#bool) |  | If set the tier has support plans. This is a read-only value and cannot be initialized. |
| has_backup_uploads | [bool](#bool) |  | If set the tier has backup uploads. This is a read-only value and cannot be initialized. |
| requires_terms_and_conditions | [bool](#bool) |  | If set, the tier requires that new deployments accept the current terms &amp; conditions. This is a read-only value and cannot be initialized. |





 

 

 


<a name="arangodb.cloud.resourcemanager.v1.ResourceManagerService"></a>

### ResourceManagerService
ResourceManagerService is the API used to configure basic resource objects.

| Method Name | Request Type | Response Type | Description |
| ----------- | ------------ | ------------- | ------------|
| GetAPIVersion | [.arangodb.cloud.common.v1.Empty](#arangodb.cloud.common.v1.Empty) | [.arangodb.cloud.common.v1.Version](#arangodb.cloud.common.v1.Version) | Get the current API version of this service. Required permissions: - None |
| ListOrganizations | [.arangodb.cloud.common.v1.ListOptions](#arangodb.cloud.common.v1.ListOptions) | [OrganizationList](#arangodb.cloud.resourcemanager.v1.OrganizationList) | Fetch all organizations that the authenticated user is a member of. Required permissions: - None |
| GetOrganization | [.arangodb.cloud.common.v1.IDOptions](#arangodb.cloud.common.v1.IDOptions) | [Organization](#arangodb.cloud.resourcemanager.v1.Organization) | Fetch an organization by its id. The authenticated user must be a member of the organization. Required permissions: - None |
| CreateOrganization | [Organization](#arangodb.cloud.resourcemanager.v1.Organization) | [Organization](#arangodb.cloud.resourcemanager.v1.Organization) | Create a new organization Required permissions: - None |
| UpdateOrganization | [Organization](#arangodb.cloud.resourcemanager.v1.Organization) | [Organization](#arangodb.cloud.resourcemanager.v1.Organization) | Update an organization Required permissions: - resourcemanager.organization.update on the organization |
| DeleteOrganization | [.arangodb.cloud.common.v1.IDOptions](#arangodb.cloud.common.v1.IDOptions) | [.arangodb.cloud.common.v1.Empty](#arangodb.cloud.common.v1.Empty) | Delete an organization Note that organization are never really removed. Instead their is_deleted field is set to true. Required permissions: - resourcemanager.organization.delete on the organization |
| ListOrganizationMembers | [.arangodb.cloud.common.v1.ListOptions](#arangodb.cloud.common.v1.ListOptions) | [MemberList](#arangodb.cloud.resourcemanager.v1.MemberList) | Get a list of members of the organization identified by the given context ID. Required permissions: - resourcemanager.organization.get on the organization |
| AddOrganizationMembers | [OrganizationMembersRequest](#arangodb.cloud.resourcemanager.v1.OrganizationMembersRequest) | [.arangodb.cloud.common.v1.Empty](#arangodb.cloud.common.v1.Empty) | Add one or more members to an organization. If there are members (in the request arguments) that are already member of the organization an AlreadyExists error is returned. Required permissions: - resourcemanager.organization.update on the organization |
| UpdateOrganizationMembers | [OrganizationMembersRequest](#arangodb.cloud.resourcemanager.v1.OrganizationMembersRequest) | [.arangodb.cloud.common.v1.Empty](#arangodb.cloud.common.v1.Empty) | Update the ownership flag of one or more members of an organization. If there are members (in the request arguments) that are not yet member of the organization, an InvalidArgument error is returned. If the request would result in the last owner no longer being an owner, an InvalidArgument error is returned. Required permissions: - resourcemanager.organization.update on the organization |
| DeleteOrganizationMembers | [OrganizationMembersRequest](#arangodb.cloud.resourcemanager.v1.OrganizationMembersRequest) | [.arangodb.cloud.common.v1.Empty](#arangodb.cloud.common.v1.Empty) | Remove one or more members from an organization. If the request would result in the last owner being removed as member of the organization, an InvalidArgument error is returned. Required permissions: - resourcemanager.organization.update on the organization |
| IsMemberOfOrganization | [IsMemberOfOrganizationRequest](#arangodb.cloud.resourcemanager.v1.IsMemberOfOrganizationRequest) | [IsMemberOfOrganizationResponse](#arangodb.cloud.resourcemanager.v1.IsMemberOfOrganizationResponse) | Is the user identified by the given user ID a member of the organization identified by the given organization ID. Required permissions: - resourcemanager.organization.get on the organization, unless the requested user is identical to the authenticated user. Note that if the identified user or organization does not exist, no is returned. |
| ListOrganizationQuotas | [ListQuotasRequest](#arangodb.cloud.resourcemanager.v1.ListQuotasRequest) | [QuotaList](#arangodb.cloud.resourcemanager.v1.QuotaList) | Get a list of quota values for the organization identified by the given context ID. If a quota is not specified on organization level, a (potentially tier specific) default value is returned. Required permissions: - resourcemanager.organization.get on the organization |
| ListProjects | [.arangodb.cloud.common.v1.ListOptions](#arangodb.cloud.common.v1.ListOptions) | [ProjectList](#arangodb.cloud.resourcemanager.v1.ProjectList) | Fetch all projects in the organization identified by the given context ID. The authenticated user must be a member of the organization identifier by the given context ID. Required permissions: - resourcemanager.project.list on the organization identified by the given context ID |
| GetProject | [.arangodb.cloud.common.v1.IDOptions](#arangodb.cloud.common.v1.IDOptions) | [Project](#arangodb.cloud.resourcemanager.v1.Project) | Fetch a project by its id. The authenticated user must be a member of the organization that owns the project. Required permissions: - resourcemanager.project.get on the project identified by the given ID |
| CreateProject | [Project](#arangodb.cloud.resourcemanager.v1.Project) | [Project](#arangodb.cloud.resourcemanager.v1.Project) | Create a new project The authenticated user must be a member of the organization that owns the project. Required permissions: - resourcemanager.project.create on the organization that owns the project |
| UpdateProject | [Project](#arangodb.cloud.resourcemanager.v1.Project) | [Project](#arangodb.cloud.resourcemanager.v1.Project) | Update a project The authenticated user must be a member of the organization that owns the project. Required permissions: - resourcemanager.project.update on the project |
| DeleteProject | [.arangodb.cloud.common.v1.IDOptions](#arangodb.cloud.common.v1.IDOptions) | [.arangodb.cloud.common.v1.Empty](#arangodb.cloud.common.v1.Empty) | Delete a project Note that project are initially only marked for deleted. Once all their resources are removed the project itself is deleted and cannot be restored. The authenticated user must be a member of the organization that owns the project. Required permissions: - resourcemanager.project.delete on the project |
| ListProjectQuotas | [ListQuotasRequest](#arangodb.cloud.resourcemanager.v1.ListQuotasRequest) | [QuotaList](#arangodb.cloud.resourcemanager.v1.QuotaList) | Get a list of quota values for the project identified by the given context ID. If a quota is not specified on project level, a value from organization level is returned. Required permissions: - resourcemanager.project.get on the project |
| ListEvents | [ListEventOptions](#arangodb.cloud.resourcemanager.v1.ListEventOptions) | [EventList](#arangodb.cloud.resourcemanager.v1.EventList) | Fetch all events in the organization identified by the given context ID. The authenticated user must be a member of the organization identifier by the given context ID. Required permissions: - resourcemanager.event.list on the organization identified by the given context ID |
| ListOrganizationInvites | [.arangodb.cloud.common.v1.ListOptions](#arangodb.cloud.common.v1.ListOptions) | [OrganizationInviteList](#arangodb.cloud.resourcemanager.v1.OrganizationInviteList) | Fetch all organization invites in the organization identified by the given context ID. The authenticated user must be a member of the organization identifier by the given context ID. Required permissions: - resourcemanager.organization-invite.list on the invite. |
| ListMyOrganizationInvites | [.arangodb.cloud.common.v1.ListOptions](#arangodb.cloud.common.v1.ListOptions) | [OrganizationInviteList](#arangodb.cloud.resourcemanager.v1.OrganizationInviteList) | Fetch all organization invites for the email address of the authenticated user. Required permissions: - None |
| GetOrganizationInvite | [.arangodb.cloud.common.v1.IDOptions](#arangodb.cloud.common.v1.IDOptions) | [OrganizationInvite](#arangodb.cloud.resourcemanager.v1.OrganizationInvite) | Fetch an organization invite by its id. The authenticated user must be a member of the organization that the invite is for. Required permissions: - resourcemanager.organization-invite.get on the invite. |
| CreateOrganizationInvite | [OrganizationInvite](#arangodb.cloud.resourcemanager.v1.OrganizationInvite) | [OrganizationInvite](#arangodb.cloud.resourcemanager.v1.OrganizationInvite) | Create a new organization invite. The authenticated user must be a member of the organization that the invite is for. Required permissions: - resourcemanager.organization-invite.create on the organization that the invite is for. |
| DeleteOrganizationInvite | [.arangodb.cloud.common.v1.IDOptions](#arangodb.cloud.common.v1.IDOptions) | [.arangodb.cloud.common.v1.Empty](#arangodb.cloud.common.v1.Empty) | Delete an organization invite The authenticated user must be a member of the organization that the invite is for. Required permissions: - resourcemanager.organization-invite.delete on the invite |
| AcceptOrganizationInvite | [.arangodb.cloud.common.v1.IDOptions](#arangodb.cloud.common.v1.IDOptions) | [.arangodb.cloud.common.v1.Empty](#arangodb.cloud.common.v1.Empty) | Accept an organization invite The authenticated user&#39;s email address must match the email address specified in the invite. Required permissions: - None |
| RejectOrganizationInvite | [.arangodb.cloud.common.v1.IDOptions](#arangodb.cloud.common.v1.IDOptions) | [.arangodb.cloud.common.v1.Empty](#arangodb.cloud.common.v1.Empty) | Reject an organization invite The authenticated user&#39;s email address must match the email address specified in the invite. Required permissions: - None |
| ListQuotaDescriptions | [.arangodb.cloud.common.v1.ListOptions](#arangodb.cloud.common.v1.ListOptions) | [QuotaDescriptionList](#arangodb.cloud.resourcemanager.v1.QuotaDescriptionList) | Fetch descriptions for all quota kinds know by the platform. Required permissions: - None |
| GetTermsAndConditions | [.arangodb.cloud.common.v1.IDOptions](#arangodb.cloud.common.v1.IDOptions) | [TermsAndConditions](#arangodb.cloud.resourcemanager.v1.TermsAndConditions) | Fetch a specific version of the Terms &amp; Conditions. Required permissions: - None |
| GetCurrentTermsAndConditions | [.arangodb.cloud.common.v1.IDOptions](#arangodb.cloud.common.v1.IDOptions) | [TermsAndConditions](#arangodb.cloud.resourcemanager.v1.TermsAndConditions) | Fetch the current version of the Terms &amp; Conditions for the organization identified by the given (optional) ID. Required permissions: - None If ID is empty. - resourcemanager.organization.get If ID is not empty. |
| GetDataProcessingAddendum | [.arangodb.cloud.common.v1.IDOptions](#arangodb.cloud.common.v1.IDOptions) | [DataProcessingAddendum](#arangodb.cloud.resourcemanager.v1.DataProcessingAddendum) | Fetch a specific version of the Data Processing Addendum. Required permissions: - None |
| GetCurrentDataProcessingAddendum | [.arangodb.cloud.common.v1.IDOptions](#arangodb.cloud.common.v1.IDOptions) | [DataProcessingAddendum](#arangodb.cloud.resourcemanager.v1.DataProcessingAddendum) | Fetch the current version of the Data Processing Addendum for the organization identified by the given (optional) ID. Required permissions: - None If ID is empty. - resourcemanager.organization.get If ID is not empty. |

 



<a name="crypto/v1/crypto.proto"></a>
<p align="right"><a href="#top">Top</a></p>

## crypto/v1/crypto.proto



<a name="arangodb.cloud.crypto.v1.CACertificate"></a>

### CACertificate
A CACertificate is represents a self-signed certificate authority used to sign
TLS certificates for deployments &amp; client authentication.


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [string](#string) |  | System identifier of the CA certificate. This is a read-only value. |
| url | [string](#string) |  | URL of this resource This is a read-only value. |
| name | [string](#string) |  | Name of the CA certificate |
| description | [string](#string) |  | Description of the CA certificate |
| project_id | [string](#string) |  | Identifier of the project that owns this CA certificate. This value cannot be changed after creation. |
| lifetime | [google.protobuf.Duration](#google.protobuf.Duration) |  | Time from creation of the CA certificate to expiration. This value cannot be changed after creation. |
| created_at | [google.protobuf.Timestamp](#google.protobuf.Timestamp) |  | The creation timestamp of the CA certificate This is a read-only value. |
| deleted_at | [google.protobuf.Timestamp](#google.protobuf.Timestamp) |  | The deletion timestamp of the CA certificate This is a read-only value. |
| expires_at | [google.protobuf.Timestamp](#google.protobuf.Timestamp) |  | The expiration timestamp of the CA certificate This is a read-only value. |
| certificate_pem | [string](#string) |  | A PEM encoded representation of the public key of the CA certificate. This is a read-only value. |
| is_deleted | [bool](#bool) |  | Set when this CA certificate is deleted. This is a read-only value. |
| is_expired | [bool](#bool) |  | Set when this CA certificate has expired. This is a read-only value. |
| will_expire_soon | [bool](#bool) |  | Set when this CA certificate will expire in the next month. This is a read-only value. |
| is_default | [bool](#bool) |  | Set when this certificate is the default in its project. This is a read-only value. |
| use_well_known_certificate | [bool](#bool) |  | When enabled, deployments using this certificate use a well known TLS certificate on the 8529 port. The self-signed certificates is always hosted on port 18529. |






<a name="arangodb.cloud.crypto.v1.CACertificateInstructions"></a>

### CACertificateInstructions
Instructions for installing &amp; uninstalling CA certificates


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| platforms | [CACertificateInstructions.PlatformInstructions](#arangodb.cloud.crypto.v1.CACertificateInstructions.PlatformInstructions) | repeated | Per platform instructions for install/uninstall of the CA certificate |






<a name="arangodb.cloud.crypto.v1.CACertificateInstructions.PlatformInstructions"></a>

### CACertificateInstructions.PlatformInstructions
Instructions for a specific platform


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| platform | [string](#string) |  | Human readable description of platform. E.g. &#34;MacOS&#34; |
| install_steps | [string](#string) | repeated | Steps needed to install |
| uninstall_steps | [string](#string) | repeated | Steps needed to uninstall |






<a name="arangodb.cloud.crypto.v1.CACertificateList"></a>

### CACertificateList
List of CACertificates.


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| items | [CACertificate](#arangodb.cloud.crypto.v1.CACertificate) | repeated |  |





 

 

 


<a name="arangodb.cloud.crypto.v1.CryptoService"></a>

### CryptoService
CryptoService is the API used to configure various crypto objects.

| Method Name | Request Type | Response Type | Description |
| ----------- | ------------ | ------------- | ------------|
| GetAPIVersion | [.arangodb.cloud.common.v1.Empty](#arangodb.cloud.common.v1.Empty) | [.arangodb.cloud.common.v1.Version](#arangodb.cloud.common.v1.Version) | Get the current API version of this service. Required permissions: - None |
| ListCACertificates | [.arangodb.cloud.common.v1.ListOptions](#arangodb.cloud.common.v1.ListOptions) | [CACertificateList](#arangodb.cloud.crypto.v1.CACertificateList) | Fetch all CA certificates in the project identified by the given context ID. Required permissions: - crypto.cacertificate.list on the project identified by the given context ID |
| GetCACertificate | [.arangodb.cloud.common.v1.IDOptions](#arangodb.cloud.common.v1.IDOptions) | [CACertificate](#arangodb.cloud.crypto.v1.CACertificate) | Fetch a CA certificate by its id. Required permissions: - crypto.cacertificate.get on the CA certificate identified by the given ID |
| GetCACertificateInstructions | [.arangodb.cloud.common.v1.IDOptions](#arangodb.cloud.common.v1.IDOptions) | [CACertificateInstructions](#arangodb.cloud.crypto.v1.CACertificateInstructions) | Fetch instructions for installing &amp; unistalling a CA certificate identified by its id on various platforms. Required permissions: - crypto.cacertificate.get on the CA certificate identified by the given ID |
| CreateCACertificate | [CACertificate](#arangodb.cloud.crypto.v1.CACertificate) | [CACertificate](#arangodb.cloud.crypto.v1.CACertificate) | Create a new CA certificate Required permissions: - crypto.cacertificate.create on the project that owns the CA certificate |
| UpdateCACertificate | [CACertificate](#arangodb.cloud.crypto.v1.CACertificate) | [CACertificate](#arangodb.cloud.crypto.v1.CACertificate) | Update a CA certificate Required permissions: - crypto.cacertificate.update on the CA certificate |
| DeleteCACertificate | [.arangodb.cloud.common.v1.IDOptions](#arangodb.cloud.common.v1.IDOptions) | [.arangodb.cloud.common.v1.Empty](#arangodb.cloud.common.v1.Empty) | Delete a CA certificate Note that CA certificate are initially only marked for deleted. Once all the resources that depend on it are removed the CA certificate itself is deleted and cannot be restored. Required permissions: - crypto.cacertificate.delete on the CA certificate |
| SetDefaultCACertificate | [CACertificate](#arangodb.cloud.crypto.v1.CACertificate) | [.arangodb.cloud.common.v1.Empty](#arangodb.cloud.common.v1.Empty) | Mark the given CA certificate as default for its containing project. Required permissions: - crypto.cacertificate.set-default on the project that owns the certificate. |

 



<a name="security/v1/security.proto"></a>
<p align="right"><a href="#top">Top</a></p>

## security/v1/security.proto



<a name="arangodb.cloud.security.v1.IPWhitelist"></a>

### IPWhitelist
IPWhitelist represents a list of CIDR ranges from which a deployment is accessible.


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [string](#string) |  | System identifier of the whitelist. This is a read-only value. |
| url | [string](#string) |  | URL of the whitelist. This is a read-only value. |
| name | [string](#string) |  | Name of the whitelist. |
| description | [string](#string) |  | Description of the whitelist. |
| project_id | [string](#string) |  | Identifier of the project that contains this whitelist. |
| cidr_ranges | [string](#string) | repeated | List of CIDR ranges. Values must follow format as defined in RFC 4632 and RFC 4291. |
| created_at | [google.protobuf.Timestamp](#google.protobuf.Timestamp) |  | The creation timestamp of this whitelist. This is a read-only value. |
| deleted_at | [google.protobuf.Timestamp](#google.protobuf.Timestamp) |  | The deletion timestamp of the whitelist This is a read-only value. |
| is_deleted | [bool](#bool) |  | Set when this whitelist is deleted. This is a read-only value. |
| created_by_id | [string](#string) |  | Identifier of the user who created this whitelist. This is a read-only value. |






<a name="arangodb.cloud.security.v1.IPWhitelistList"></a>

### IPWhitelistList
List of IP whitelists.


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| items | [IPWhitelist](#arangodb.cloud.security.v1.IPWhitelist) | repeated |  |





 

 

 


<a name="arangodb.cloud.security.v1.SecurityService"></a>

### SecurityService
SecurityService is the API used to access security entities.

| Method Name | Request Type | Response Type | Description |
| ----------- | ------------ | ------------- | ------------|
| GetAPIVersion | [.arangodb.cloud.common.v1.Empty](#arangodb.cloud.common.v1.Empty) | [.arangodb.cloud.common.v1.Version](#arangodb.cloud.common.v1.Version) | Get the current API version of this service. Required permissions: - None |
| ListIPWhitelists | [.arangodb.cloud.common.v1.ListOptions](#arangodb.cloud.common.v1.ListOptions) | [IPWhitelistList](#arangodb.cloud.security.v1.IPWhitelistList) | Fetch all IP whitelists that belong to the project identified by the given context ID. Required permissions: - security.ipwhitelist.list on the project identified by the given context ID. |
| GetIPWhitelist | [.arangodb.cloud.common.v1.IDOptions](#arangodb.cloud.common.v1.IDOptions) | [IPWhitelist](#arangodb.cloud.security.v1.IPWhitelist) | Fetch an IP whitelist by its id. Required permissions: - security.ipwhitelist.get on the IP whitelist |
| CreateIPWhitelist | [IPWhitelist](#arangodb.cloud.security.v1.IPWhitelist) | [IPWhitelist](#arangodb.cloud.security.v1.IPWhitelist) | Create a new IP whitelist Required permissions: - security.ipwhitelist.create on the project that owns the IP whitelist. |
| UpdateIPWhitelist | [IPWhitelist](#arangodb.cloud.security.v1.IPWhitelist) | [IPWhitelist](#arangodb.cloud.security.v1.IPWhitelist) | Update an IP whitelist Required permissions: - security.ipwhitelist.update on the IP whitelist |
| DeleteIPWhitelist | [.arangodb.cloud.common.v1.IDOptions](#arangodb.cloud.common.v1.IDOptions) | [.arangodb.cloud.common.v1.Empty](#arangodb.cloud.common.v1.Empty) | Delete an IP whitelist. Note that IP whitelists are initially only marked for deletion. Once all their dependent deployments are removed, the whitelist is removed. Required permissions: - security.ipwhitelist.delete on the IP whitelist |

 



<a name="platform/v1/platform.proto"></a>
<p align="right"><a href="#top">Top</a></p>

## platform/v1/platform.proto



<a name="arangodb.cloud.platform.v1.ListProvidersRequest"></a>

### ListProvidersRequest
Request arguments for ListProviders


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| options | [arangodb.cloud.common.v1.ListOptions](#arangodb.cloud.common.v1.ListOptions) |  | Common list options |
| organization_id | [string](#string) |  | If set, the result includes all providers for that are available for the organization identified by this ID. If not set, only providers are returned that are available to all organizations. |






<a name="arangodb.cloud.platform.v1.ListRegionsRequest"></a>

### ListRegionsRequest
Request arguments for ListRegions


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| options | [arangodb.cloud.common.v1.ListOptions](#arangodb.cloud.common.v1.ListOptions) |  | Common list options |
| provider_id | [string](#string) |  | Required identifier of the provider to list regions for. |
| organization_id | [string](#string) |  | If set, the result includes all regions for that are available for the organization identified by this ID. If not set, only regions are returned that are available to all organizations. |






<a name="arangodb.cloud.platform.v1.Provider"></a>

### Provider
Provider represents a specific cloud provider such as AWS or GCP.


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [string](#string) |  | System identifier of the provider. |
| name | [string](#string) |  | Name of the provider |
| prerelease | [bool](#bool) |  | If set, this provider has not be released as generally available. |






<a name="arangodb.cloud.platform.v1.ProviderList"></a>

### ProviderList
List of providers.


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| items | [Provider](#arangodb.cloud.platform.v1.Provider) | repeated |  |






<a name="arangodb.cloud.platform.v1.Region"></a>

### Region
Region represents a geographical region in which deployments are run.


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [string](#string) |  | System identifier of the region. |
| provider_id | [string](#string) |  | Identifier of the provider that hosts this region. |
| location | [string](#string) |  | Location of the region |
| available | [bool](#bool) |  | Is this region available for creating new deployments? |
| low_stock | [bool](#bool) |  | If set, this region is low on stock. Creating a deployment may not be possible. |
| out_of_stock | [bool](#bool) |  | If set, this region is out of stock. Creating a deployment is currently not possible. |
| prerelease | [bool](#bool) |  | If set, this region has not be released as generally available. |






<a name="arangodb.cloud.platform.v1.RegionList"></a>

### RegionList
List of regions.


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| items | [Region](#arangodb.cloud.platform.v1.Region) | repeated |  |





 

 

 


<a name="arangodb.cloud.platform.v1.PlatformService"></a>

### PlatformService
PlatformService is the API used to query for cloud provider &amp; regional info.

| Method Name | Request Type | Response Type | Description |
| ----------- | ------------ | ------------- | ------------|
| GetAPIVersion | [.arangodb.cloud.common.v1.Empty](#arangodb.cloud.common.v1.Empty) | [.arangodb.cloud.common.v1.Version](#arangodb.cloud.common.v1.Version) | Get the current API version of this service. Required permissions: - None |
| ListProviders | [ListProvidersRequest](#arangodb.cloud.platform.v1.ListProvidersRequest) | [ProviderList](#arangodb.cloud.platform.v1.ProviderList) | Fetch all providers that are supported by the ArangoDB cloud. Required permissions: - None |
| GetProvider | [.arangodb.cloud.common.v1.IDOptions](#arangodb.cloud.common.v1.IDOptions) | [Provider](#arangodb.cloud.platform.v1.Provider) | Fetch a provider by its id. Required permissions: - None |
| ListRegions | [ListRegionsRequest](#arangodb.cloud.platform.v1.ListRegionsRequest) | [RegionList](#arangodb.cloud.platform.v1.RegionList) | Fetch all regions provided by the provided identified by the given context ID. If the given context identifier contains a valid organization ID, the result includes all regions for that organization. Otherwise only regions are returned that are available to all organizations. Required permissions: - None |
| GetRegion | [.arangodb.cloud.common.v1.IDOptions](#arangodb.cloud.common.v1.IDOptions) | [Region](#arangodb.cloud.platform.v1.Region) | Fetch a region by its id. Required permissions: - None |

 



<a name="usage/v1/usage.proto"></a>
<p align="right"><a href="#top">Top</a></p>

## usage/v1/usage.proto



<a name="arangodb.cloud.usage.v1.ListUsageItemsRequest"></a>

### ListUsageItemsRequest
Request arguments for ListUsageItems


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| organization_id | [string](#string) |  | Request usage items for the organization with this id. This is a required field. |
| from | [google.protobuf.Timestamp](#google.protobuf.Timestamp) |  | Request usage items that overlaps in time with the time period that starts with this timestamp (inclusive). This is a required field. |
| to | [google.protobuf.Timestamp](#google.protobuf.Timestamp) |  | Request usage items that overlaps in time with the time period that ends with this timestamp (inclusive). This is a required field. |
| options | [arangodb.cloud.common.v1.ListOptions](#arangodb.cloud.common.v1.ListOptions) |  | Standard list options This is an optional field. |
| resource_url | [string](#string) |  | Limit to usage items for the resource with this URL. This is an optional field. |
| resource_kind | [string](#string) |  | Limit to usage items for the resource with this kind. This is an optional field. |
| project_id | [string](#string) |  | Limit to usage items for the project with this id. This is an optional field. |
| deployment_id | [string](#string) |  | Limit to usage items for the deployment with this id. This is an optional field. |
| has_no_invoice_id | [bool](#bool) |  | If set, limit to usage items that have no invoice_id set. |
| has_invoice_id | [bool](#bool) |  | If set, limit to usage items that have an invoice_id set. |
| invoice_id | [string](#string) |  | If set, limit to usage items that have the invoice_id set to this specific value. This is an optional field. |






<a name="arangodb.cloud.usage.v1.UsageItem"></a>

### UsageItem
A UsageItem message contained usage tracking information for a tracked
resource (usually deployment) in a specific time period.


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [string](#string) |  | System identifier of the usage item. |
| url | [string](#string) |  | URL of this resource |
| kind | [string](#string) |  | Kind of usage item |
| resource | [UsageItem.Resource](#arangodb.cloud.usage.v1.UsageItem.Resource) |  | Identification of the resource covered by this usage item |
| starts_at | [google.protobuf.Timestamp](#google.protobuf.Timestamp) |  | This usage item covers a time period that starts at this timestamp |
| ends_at | [google.protobuf.Timestamp](#google.protobuf.Timestamp) |  | This usage item covers a time period that ends at this timestamp. If the usage item has not yet ended, this field is is set to the current time. |
| has_ended | [bool](#bool) |  | Set when this usage item has ended. |
| tier_id | [string](#string) |  | Identifier of the tier the organization was using at the start of this usage period. |
| invoice_id | [string](#string) |  | Identifier of the invoice that includes this usage item. The usage item must be ended when this field it set. |
| deployment_size | [UsageItem.DeploymentSize](#arangodb.cloud.usage.v1.UsageItem.DeploymentSize) |  | Amount of (computer) resources used by the resource covered by this usage item. This field is only set when the usage item is of kind DeploymentSize. |
| network_transfer_size | [UsageItem.NetworkTransferSize](#arangodb.cloud.usage.v1.UsageItem.NetworkTransferSize) |  | Amount of network traffic used by the resource covered by this usage item. This field is only set when the usage item is of kind NetworkTransferSize. |
| backup_storage_size | [UsageItem.BackupStorageSize](#arangodb.cloud.usage.v1.UsageItem.BackupStorageSize) |  | Amount of backup related cloud storage used by the resource covered by this usage item. This field is only set when the usage item is of kind BackupStorageSize. |






<a name="arangodb.cloud.usage.v1.UsageItem.BackupStorageSize"></a>

### UsageItem.BackupStorageSize



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| cloud_storage_size | [int64](#int64) |  | Amount of cloud storage (in bytes) used by backups of a deployment. |






<a name="arangodb.cloud.usage.v1.UsageItem.DeploymentSize"></a>

### UsageItem.DeploymentSize



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| coordinators | [int32](#int32) |  | Number of coordinators of the deployment |
| coordinator_memory_size | [int32](#int32) |  | Amount of memory (in GB) allocated for each coordinator. |
| dbservers | [int32](#int32) |  | Number of dbservers of the deployment |
| dbserver_memory_size | [int32](#int32) |  | Amount of memory (in GB) allocated for each dbserver. |
| dbserver_disk_size | [int32](#int32) |  | Amount of disk space (in GB) allocated for each dbserver. |
| agents | [int32](#int32) |  | Number of agents of the deployment |
| agent_memory_size | [int32](#int32) |  | Amount of memory (in GB) allocated for each agent. |
| agent_disk_size | [int32](#int32) |  | Amount of disk space (in GB) allocated for each agent. |
| node_size_id | [string](#string) |  | Identifier of the node-size used for this deployment (empty for flexible) |






<a name="arangodb.cloud.usage.v1.UsageItem.NetworkTransferSize"></a>

### UsageItem.NetworkTransferSize



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| total_transfer_ingress_size | [int64](#int64) |  | Total amount of network ingress traffic (in bytes) caused by the use of a deployment. This is excluding inner cluster traffic and excluding backup traffic (downloads). |
| total_transfer_egress_size | [int64](#int64) |  | Total amount of network egress traffic (in bytes) caused by the use of a deployment. This is excluding inner cluster traffic and excluding backup traffic (uploads).

Note: In the future we want to split between cross_region_transfer_x and inner_region_transfer_x, the total_transfer_x is the sum of these 2. Inner region can be cross availability zone. |






<a name="arangodb.cloud.usage.v1.UsageItem.Resource"></a>

### UsageItem.Resource



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [string](#string) |  | System identifier of the resource that this usage item covers. |
| url | [string](#string) |  | URL of the resource that this usage item covers |
| kind | [string](#string) |  | Kind of resource that this usage item covers. |
| description | [string](#string) |  | Human readable description of the resource that this usage item covers. |
| organization_id | [string](#string) |  | Identifier of the organization that owns the resource that this usage item covers. |
| organization_name | [string](#string) |  | Name of the organization that owns the resource that this usage item covers. |
| project_id | [string](#string) |  | Identifier of the project that owns the resource that this usage item covers. |
| project_name | [string](#string) |  | Name of the project that owns the resource that this usage item covers. |
| deployment_id | [string](#string) |  | Identifier of the deployment that owns the resource that this usage item covers. |
| deployment_name | [string](#string) |  | Name of the deployment that owns the resource that this usage item covers. |
| deployment_member_name | [string](#string) |  | Name of the deployment member that owns the resource that this usage item covers. This field is only set when the usage item is specific for a member of the deployment (e.g. network transfer) |
| cloud_provider_id | [string](#string) |  | Identifier of the cloud provider that is used to run the deployment. |
| cloud_region_id | [string](#string) |  | Identifier of the cloud region that is used to run the deployment. |
| support_plan_id | [string](#string) |  | Identifier of the support plan that is attached to the deployment. |
| deployment_model | [string](#string) |  | Model of the deployment |






<a name="arangodb.cloud.usage.v1.UsageItemList"></a>

### UsageItemList
List of UsageItems.


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| items | [UsageItem](#arangodb.cloud.usage.v1.UsageItem) | repeated |  |





 

 

 


<a name="arangodb.cloud.usage.v1.UsageService"></a>

### UsageService
UsageService is the API used to fetch usage tracking information.

| Method Name | Request Type | Response Type | Description |
| ----------- | ------------ | ------------- | ------------|
| GetAPIVersion | [.arangodb.cloud.common.v1.Empty](#arangodb.cloud.common.v1.Empty) | [.arangodb.cloud.common.v1.Version](#arangodb.cloud.common.v1.Version) | Get the current API version of this service. Required permissions: - None |
| ListUsageItems | [ListUsageItemsRequest](#arangodb.cloud.usage.v1.ListUsageItemsRequest) | [UsageItemList](#arangodb.cloud.usage.v1.UsageItemList) | Fetch all UsageItem resources in the organization identified by the given organization ID that match the given criteria. Required permissions: - usage.usageitem.list on the organization identified by the given organization ID |

 



<a name="common/v1/common.proto"></a>
<p align="right"><a href="#top">Top</a></p>

## common/v1/common.proto



<a name="arangodb.cloud.common.v1.Budget"></a>

### Budget
Budget for resources of a specific kind


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| used | [int64](#int64) |  | How many resources of the specific kind are in use |
| available | [int64](#int64) |  | How many resources of the specific kind are still available. Note a value above 0 does not mean that the caller has permission to add those resources. |
| unlimited | [bool](#bool) |  | If set, there is no limit to the number of resources of a specific kind that can be created. If set, available is 0. |






<a name="arangodb.cloud.common.v1.Empty"></a>

### Empty
Empty message






<a name="arangodb.cloud.common.v1.IDOptions"></a>

### IDOptions
Options for a get-by-id request


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [string](#string) |  | System identifier of the object to fetch. |






<a name="arangodb.cloud.common.v1.ListOptions"></a>

### ListOptions
Options for a list request.


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| page_size | [int32](#int32) |  | Maximum number of items to return. If not specified, a default number items are returned. Unless specified otherwise, the default number is DefaultPageSize. |
| page | [int64](#int64) |  | Page to start with (defaults to 0). |
| context_id | [string](#string) |  | Identifier of the resource in which the list request is made. |






<a name="arangodb.cloud.common.v1.URLOptions"></a>

### URLOptions
Options for a get-by-url request


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| url | [string](#string) |  | URL of the resource to fetch. |






<a name="arangodb.cloud.common.v1.Version"></a>

### Version
Semantic version number.


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| major | [int32](#int32) |  | Major version (increasing may break APIs) |
| minor | [int32](#int32) |  | Minor version (increased for new features) |
| patch | [int32](#int32) |  | Patch version (increased for fixed) |






<a name="arangodb.cloud.common.v1.YesOrNo"></a>

### YesOrNo
Response for single boolean.


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| result | [bool](#bool) |  |  |





 

 

 

 



<a name="iam/v1/iam.proto"></a>
<p align="right"><a href="#top">Top</a></p>

## iam/v1/iam.proto



<a name="arangodb.cloud.iam.v1.APIKey"></a>

### APIKey
API Keys are authentication &#34;keys&#34; intended to be used for scripting.


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [string](#string) |  | Identifier of this key |
| url | [string](#string) |  | URL of this key. |
| user_id | [string](#string) |  | User represented by this key |
| organization_id | [string](#string) |  | If set, this key only grants access to this organization. |
| is_readonly | [bool](#bool) |  | If set, this key only grants access to read-only API&#39;s (List..., Get...) |
| created_at | [google.protobuf.Timestamp](#google.protobuf.Timestamp) |  | The creation timestamp of the key |
| expires_at | [google.protobuf.Timestamp](#google.protobuf.Timestamp) |  | The expiration timestamp of the key |
| is_expired | [bool](#bool) |  | Set when this key is expired. |
| revoked_at | [google.protobuf.Timestamp](#google.protobuf.Timestamp) |  | The revocation timestamp of the key (if any) |
| is_revoked | [bool](#bool) |  | Set when this key is explicitly revoked. |






<a name="arangodb.cloud.iam.v1.APIKeyList"></a>

### APIKeyList
List of APIKey&#39;s


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| items | [APIKey](#arangodb.cloud.iam.v1.APIKey) | repeated |  |






<a name="arangodb.cloud.iam.v1.APIKeySecret"></a>

### APIKeySecret
API key secrets are used once to inform the users of the secret
for an API key.


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [string](#string) |  | ID of the API key |
| secret | [string](#string) |  | Secret of the API key |






<a name="arangodb.cloud.iam.v1.AuthenticateAPIKeyRequest"></a>

### AuthenticateAPIKeyRequest
Request arguments for AuthenticateAPIKey


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [string](#string) |  | API key id |
| secret | [string](#string) |  | Secret of the API key |
| time_to_live | [google.protobuf.Duration](#google.protobuf.Duration) |  | Life time of the token. If set, then this TTL is used reduce the default TTL of an authentication token. It cannot be used to increase the default lifetime of a token. |






<a name="arangodb.cloud.iam.v1.AuthenticateAPIKeyResponse"></a>

### AuthenticateAPIKeyResponse
Response for AuthenticateAPIKey


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| token | [string](#string) |  | Bearer token |
| time_to_live | [google.protobuf.Duration](#google.protobuf.Duration) |  | Actual life time of the token. |






<a name="arangodb.cloud.iam.v1.CreateAPIKeyRequest"></a>

### CreateAPIKeyRequest
Request arguments for CreateAPIKey.


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| organization_id | [string](#string) |  | If set, the created key only grants access to this organization. |
| readonly | [bool](#bool) |  | If set, the created key only grants access to read-only API&#39;s (List..., Get...). If not set, the created key grants access to all API&#39;s (that the user has access to). |
| time_to_live | [google.protobuf.Duration](#google.protobuf.Duration) |  | Duration between now and the expiration date of the created key. A value of 0 means that the API key will not expire. You can still use RevokeAPIKey to revoke such API keys. |






<a name="arangodb.cloud.iam.v1.Group"></a>

### Group
Group of user accounts.


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [string](#string) |  | System identifier of the group. This is a read-only value. |
| organization_id | [string](#string) |  | Identifier of the organization that owns this group. |
| name | [string](#string) |  | Name of the group |
| description | [string](#string) |  | Description of the group |
| created_at | [google.protobuf.Timestamp](#google.protobuf.Timestamp) |  | The creation timestamp of the group |
| deleted_at | [google.protobuf.Timestamp](#google.protobuf.Timestamp) |  | The deletion timestamp of the group |
| is_deleted | [bool](#bool) |  | Set when this organization is deleted. This is a read-only value. |
| url | [string](#string) |  | URL of this resource This is a read-only value and cannot be initialized. |
| is_virtual | [bool](#bool) |  | Set if this group is virtual and managed by the system. This is a read-only value. |






<a name="arangodb.cloud.iam.v1.GroupList"></a>

### GroupList
List of groups.


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| items | [Group](#arangodb.cloud.iam.v1.Group) | repeated |  |






<a name="arangodb.cloud.iam.v1.GroupMemberList"></a>

### GroupMemberList
List of group members (user ID&#39;s)


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| items | [string](#string) | repeated | List of ID&#39;s of users that are member of the group. |






<a name="arangodb.cloud.iam.v1.GroupMembersRequest"></a>

### GroupMembersRequest
Request arguments for Add/DeleteGroupMembers.


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| group_id | [string](#string) |  | ID of the group to add/remove members to/from. |
| user_ids | [string](#string) | repeated | ID&#39;s of users to add/remove to/from the group. |






<a name="arangodb.cloud.iam.v1.HasPermissionsRequest"></a>

### HasPermissionsRequest
Request arguments for HasPermissionsRequest.


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| url | [string](#string) |  | URL of the resource to query permissions for. |
| permissions | [string](#string) | repeated | The list of permissions that are required. |






<a name="arangodb.cloud.iam.v1.IsMemberOfGroupRequest"></a>

### IsMemberOfGroupRequest
Request arguments for IsMemberOfGroup.


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| user_id | [string](#string) |  | Identifier of the user |
| group_id | [string](#string) |  | Identifier of the group |






<a name="arangodb.cloud.iam.v1.PermissionList"></a>

### PermissionList
List of permissions.


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| items | [string](#string) | repeated |  |






<a name="arangodb.cloud.iam.v1.Policy"></a>

### Policy
Policy bindings members to roles for access to a resource.


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| resource_url | [string](#string) |  | URL of the resource to which this policy applies. |
| bindings | [RoleBinding](#arangodb.cloud.iam.v1.RoleBinding) | repeated | Role bindings to apply to the resource. |






<a name="arangodb.cloud.iam.v1.RenewAPIKeyTokenRequest"></a>

### RenewAPIKeyTokenRequest
Request arguments for RenewAPIKeyToken.


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| token | [string](#string) |  | Bearer token |
| time_to_live | [google.protobuf.Duration](#google.protobuf.Duration) |  | Extended life time of the token. By default, a renewed token will have a default lifetime from the moment of the renew call. If this field is set, then this TTL is used reduce the default TTL of the renewed token. It cannot be used to increase the default lifetime of the renewed token. |






<a name="arangodb.cloud.iam.v1.RenewAPIKeyTokenResponse"></a>

### RenewAPIKeyTokenResponse
Response for RenewAPIKeyToken.


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| time_to_live | [google.protobuf.Duration](#google.protobuf.Duration) |  | Actual life time of the token. |






<a name="arangodb.cloud.iam.v1.RevokeAPIKeyTokenRequest"></a>

### RevokeAPIKeyTokenRequest
Request arguments for RevokeAPIKeyToken.


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| token | [string](#string) |  | Bearer token |






<a name="arangodb.cloud.iam.v1.Role"></a>

### Role
A role is a list of permissions.
Roles can be bound to resources for members.


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [string](#string) |  | System identifier of the role. This is a read-only value. |
| organization_id | [string](#string) |  | Identifier of the organization that owns this role. This value is undefined for predefined roles. |
| name | [string](#string) |  | Name of the role |
| description | [string](#string) |  | Description of the role |
| permissions | [string](#string) | repeated | Permissions to grant when this role is bound. |
| is_predefined | [bool](#bool) |  | Set if this role is predefined. This is a read-only value. |
| created_at | [google.protobuf.Timestamp](#google.protobuf.Timestamp) |  | The creation timestamp of the role |
| deleted_at | [google.protobuf.Timestamp](#google.protobuf.Timestamp) |  | The deletion timestamp of the role |
| is_deleted | [bool](#bool) |  | Set when this organization is deleted. This is a read-only value. |
| url | [string](#string) |  | URL of this resource This is a read-only value and cannot be initialized. |






<a name="arangodb.cloud.iam.v1.RoleBinding"></a>

### RoleBinding
RoleBinding binds a Role to a member.


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [string](#string) |  | System identifier of the role-binding. This is a read-only value. |
| member_id | [string](#string) |  | Identifier of the member to bind a role to. Member ID is formatted as: - user:&lt;user_id&gt; - group:&lt;group_id&gt; |
| role_id | [string](#string) |  | Identifier of the Role to grant to member |
| delete_not_allowed | [bool](#bool) |  | If set, this this role-binding cannot be deleted This is a read-only value. |






<a name="arangodb.cloud.iam.v1.RoleBindingsRequest"></a>

### RoleBindingsRequest
Request arguments for Add/DeleteRoleBindings.


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| resource_url | [string](#string) |  | URL of the resource to add/remove policy binding to/from. |
| bindings | [RoleBinding](#arangodb.cloud.iam.v1.RoleBinding) | repeated | Role bindings to add/remove to the policy. |






<a name="arangodb.cloud.iam.v1.RoleList"></a>

### RoleList
List of roles.


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| items | [Role](#arangodb.cloud.iam.v1.Role) | repeated |  |






<a name="arangodb.cloud.iam.v1.User"></a>

### User
User represents an actual person.


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [string](#string) |  | Identifier of the user. This is a read-only value. |
| email | [string](#string) |  | Primary email address of the user. All emails send to this user will use this address. This is a read-only value. |
| name | [string](#string) |  | Name of the user. This may be empty if not filled out by the user. |
| given_name | [string](#string) |  | Given name of the user. This may be empty if not filled out by the user. |
| family_name | [string](#string) |  | Family name of the user. This may be empty if not filled out by the user. |
| created_at | [google.protobuf.Timestamp](#google.protobuf.Timestamp) |  | The creation timestamp of the user. This is a read-only value. |
| additional_emails | [string](#string) | repeated | Additional email addresses of the user. This will be filled in when the authentication provided knows multiple email addresses for the user. This is a read-only value. |
| mobile_phone | [string](#string) |  | Mobile phone number of the user. This value must be unique globally.

This field will not be filled, unless: - The currently authenticated user is this user - The currently authenticated user has `iam.user.get-personal-data` permission on the organization that user is a member of.

This value can only be changed to a non-empty value. If changed, the new number has to be verified again. |
| mobile_phone_verified | [bool](#bool) |  | Set when the mobile phone number has been successfully verified. This is a read-only value. |
| company_name | [string](#string) |  | Company name of the user This may be empty if not filled out by the user. |
| dashboard_access_denied | [bool](#bool) |  | If set, this user is denied access to the dashboard. This is a read-only value. |
| dashboard_access_denied_reason | [string](#string) |  | If set, this field describes the reason why this user is denied access to the dashboard. This is a read-only value. |
| apikey_id | [string](#string) |  | If set, this user is currently being authenticated using an API key (identified by this ID) |
| slack_name | [string](#string) |  | If set, contains Slack name of this user in the arangodb-community slack. |
| last_login_at | [google.protobuf.Timestamp](#google.protobuf.Timestamp) |  | The timestamp of the last login of the user. This is a read-only value. |
| last_ip | [string](#string) |  | If set, contains IP address from which the user last logged in. |
| mobile_phone_needs_verification | [bool](#bool) |  | Defines if a user&#39;s mobile phone number needs verification based on email root domain address. |






<a name="arangodb.cloud.iam.v1.VerifyUserMobilePhoneRequest"></a>

### VerifyUserMobilePhoneRequest
Request arguments for VerifyUserMobilePhone


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| code | [string](#string) |  | Code that was send to the mobile phone number. |





 

 

 


<a name="arangodb.cloud.iam.v1.IAMService"></a>

### IAMService
IAMService is the API used to configure IAM objects.

| Method Name | Request Type | Response Type | Description |
| ----------- | ------------ | ------------- | ------------|
| GetAPIVersion | [.arangodb.cloud.common.v1.Empty](#arangodb.cloud.common.v1.Empty) | [.arangodb.cloud.common.v1.Version](#arangodb.cloud.common.v1.Version) | Get the current API version of this service. Required permissions: - None |
| GetThisUser | [.arangodb.cloud.common.v1.Empty](#arangodb.cloud.common.v1.Empty) | [User](#arangodb.cloud.iam.v1.User) | Fetch all available information of the currently authenticated user. Required permissions: - None |
| GetUser | [.arangodb.cloud.common.v1.IDOptions](#arangodb.cloud.common.v1.IDOptions) | [User](#arangodb.cloud.iam.v1.User) | Fetch all available information of the user identified by the given ID. Required permissions: - resourcemanager.organization.get on one of the organizations that the requested user and authenticated user are both a member of |
| UpdateUser | [User](#arangodb.cloud.iam.v1.User) | [User](#arangodb.cloud.iam.v1.User) | Update a user Required permissions: - None if the given user is the authenticated user. or - resourcemanager.organization.get on one of the organizations that the requested user and authenticated user are both a member of and - iam.user.update on organization on one of the organizations that the requested user and authenticated user are both a member of |
| VerifyUserMobilePhone | [VerifyUserMobilePhoneRequest](#arangodb.cloud.iam.v1.VerifyUserMobilePhoneRequest) | [.arangodb.cloud.common.v1.Empty](#arangodb.cloud.common.v1.Empty) | Verify the mobile phone number of a user, by provided the unique code that was send to the number. If the code is valid an empty result is returned, otherwise an InvalidArgument error is returned. The authenticated user is always the subject of this request. Required permissions: - None (since the subject is always the authenticated user). |
| ResendUserMobilePhoneVerification | [.arangodb.cloud.common.v1.Empty](#arangodb.cloud.common.v1.Empty) | [.arangodb.cloud.common.v1.Empty](#arangodb.cloud.common.v1.Empty) | Resend a verification code to the mobile phone number listed for the authenticated user. Required permissions: - None (since the subject is always the authenticated user). |
| ListGroups | [.arangodb.cloud.common.v1.ListOptions](#arangodb.cloud.common.v1.ListOptions) | [GroupList](#arangodb.cloud.iam.v1.GroupList) | Fetch all groups of the organization identified by the given context ID. Required permissions: - iam.group.list on organization identified by given context ID. |
| GetGroup | [.arangodb.cloud.common.v1.IDOptions](#arangodb.cloud.common.v1.IDOptions) | [Group](#arangodb.cloud.iam.v1.Group) | Fetch a group by its id. Required permissions: - iam.group.get on organization that owns the group |
| CreateGroup | [Group](#arangodb.cloud.iam.v1.Group) | [Group](#arangodb.cloud.iam.v1.Group) | Create a group Required permissions: - iam.group.create on organization that owns the group |
| UpdateGroup | [Group](#arangodb.cloud.iam.v1.Group) | [Group](#arangodb.cloud.iam.v1.Group) | Update a group Required permissions: - iam.group.update on organization that owns the group |
| DeleteGroup | [.arangodb.cloud.common.v1.IDOptions](#arangodb.cloud.common.v1.IDOptions) | [.arangodb.cloud.common.v1.Empty](#arangodb.cloud.common.v1.Empty) | Delete a group Required permissions: - iam.group.delete on organization that owns the group |
| ListGroupMembers | [.arangodb.cloud.common.v1.ListOptions](#arangodb.cloud.common.v1.ListOptions) | [GroupMemberList](#arangodb.cloud.iam.v1.GroupMemberList) | List of members of the group identified by the given context ID. Required permissions: - iam.group.get on organization that owns the group |
| AddGroupMembers | [GroupMembersRequest](#arangodb.cloud.iam.v1.GroupMembersRequest) | [.arangodb.cloud.common.v1.Empty](#arangodb.cloud.common.v1.Empty) | Add one or more members to the group identified by given ID. Required permissions: - iam.group.update on organization that owns the group |
| DeleteGroupMembers | [GroupMembersRequest](#arangodb.cloud.iam.v1.GroupMembersRequest) | [.arangodb.cloud.common.v1.Empty](#arangodb.cloud.common.v1.Empty) | Remove one or more members from the group identified by given ID. Required permissions: - iam.group.update on organization that owns the group |
| IsMemberOfGroup | [IsMemberOfGroupRequest](#arangodb.cloud.iam.v1.IsMemberOfGroupRequest) | [.arangodb.cloud.common.v1.YesOrNo](#arangodb.cloud.common.v1.YesOrNo) | Is the user identified by the given user ID a member of the group identified by the given group ID. Required permissions: - iam.group.get on organization that owns the group, unless the requested user is identical to the authenticated user. Note that if the identified group does not exist, no is returned. |
| ListRoles | [.arangodb.cloud.common.v1.ListOptions](#arangodb.cloud.common.v1.ListOptions) | [RoleList](#arangodb.cloud.iam.v1.RoleList) | Fetch all roles in the organization identified by the given context ID. Required permissions: - iam.role.list on organization identified by given context ID. |
| GetRole | [.arangodb.cloud.common.v1.IDOptions](#arangodb.cloud.common.v1.IDOptions) | [Role](#arangodb.cloud.iam.v1.Role) | Fetch a role by its id. Required permissions: - iam.role.get on organization that owns the role |
| CreateRole | [Role](#arangodb.cloud.iam.v1.Role) | [Role](#arangodb.cloud.iam.v1.Role) | Create a custom role Required permissions: - iam.role.create on organization that owns the role |
| UpdateRole | [Role](#arangodb.cloud.iam.v1.Role) | [Role](#arangodb.cloud.iam.v1.Role) | Update a custom role Required permissions: - iam.role.update on organization that owns the role |
| DeleteRole | [.arangodb.cloud.common.v1.IDOptions](#arangodb.cloud.common.v1.IDOptions) | [.arangodb.cloud.common.v1.Empty](#arangodb.cloud.common.v1.Empty) | Delete a custom role Required permissions: - iam.role.delete on organization that owns the role |
| GetPolicy | [.arangodb.cloud.common.v1.URLOptions](#arangodb.cloud.common.v1.URLOptions) | [Policy](#arangodb.cloud.iam.v1.Policy) | Get the policy for a resource identified by given URL. Required permissions: - iam.policy.get on resource identified by the url |
| AddRoleBindings | [RoleBindingsRequest](#arangodb.cloud.iam.v1.RoleBindingsRequest) | [Policy](#arangodb.cloud.iam.v1.Policy) | Add one or more RoleBindings to the policy of a resource identified by given URL. Required permissions: - iam.policy.update on resource identified by the url |
| DeleteRoleBindings | [RoleBindingsRequest](#arangodb.cloud.iam.v1.RoleBindingsRequest) | [Policy](#arangodb.cloud.iam.v1.Policy) | Remove one or more RoleBindings from the policy of a resource identified by given URL. Required permissions: - iam.policy.update on resource identified by the url |
| GetEffectivePermissions | [.arangodb.cloud.common.v1.URLOptions](#arangodb.cloud.common.v1.URLOptions) | [PermissionList](#arangodb.cloud.iam.v1.PermissionList) | Return the list of permissions that are available to the currently authenticated used for actions on the resource identified by the given URL. Required permissions: - None |
| HasPermissions | [HasPermissionsRequest](#arangodb.cloud.iam.v1.HasPermissionsRequest) | [.arangodb.cloud.common.v1.YesOrNo](#arangodb.cloud.common.v1.YesOrNo) | Does the authenticated user have all of the requested permissions for the resource identified by the given URL? Required permissions: - None |
| ListPermissions | [.arangodb.cloud.common.v1.Empty](#arangodb.cloud.common.v1.Empty) | [PermissionList](#arangodb.cloud.iam.v1.PermissionList) | List all known permissions. Required permissions: - None |
| ListAPIKeys | [.arangodb.cloud.common.v1.ListOptions](#arangodb.cloud.common.v1.ListOptions) | [APIKeyList](#arangodb.cloud.iam.v1.APIKeyList) | Fetch all API keys owned by the authenticated caller. Required permissions: - None |
| GetAPIKey | [.arangodb.cloud.common.v1.IDOptions](#arangodb.cloud.common.v1.IDOptions) | [APIKey](#arangodb.cloud.iam.v1.APIKey) | Fetch an API key by its id. The API key must be owned by the authenticated caller. Required permissions: - None |
| CreateAPIKey | [CreateAPIKeyRequest](#arangodb.cloud.iam.v1.CreateAPIKeyRequest) | [APIKeySecret](#arangodb.cloud.iam.v1.APIKeySecret) | Create a new API key. The API key will be owned by the authenticated caller. Required permissions: - None |
| RevokeAPIKey | [.arangodb.cloud.common.v1.IDOptions](#arangodb.cloud.common.v1.IDOptions) | [.arangodb.cloud.common.v1.Empty](#arangodb.cloud.common.v1.Empty) | Ensure that the expiration date of the API key identified by given ID is either in the past or set to now. The API key must be owned by the authenticated caller. Required permissions: - None |
| DeleteAPIKey | [.arangodb.cloud.common.v1.IDOptions](#arangodb.cloud.common.v1.IDOptions) | [.arangodb.cloud.common.v1.Empty](#arangodb.cloud.common.v1.Empty) | Delete the API key identified by given ID The API key must be owned by the authenticated caller. Required permissions: - None |
| AuthenticateAPIKey | [AuthenticateAPIKeyRequest](#arangodb.cloud.iam.v1.AuthenticateAPIKeyRequest) | [AuthenticateAPIKeyResponse](#arangodb.cloud.iam.v1.AuthenticateAPIKeyResponse) | Authenticate using an API key. If authentication succeeds, this function returns a bearer token. That token must be used to authenticate all other API requests. If the given API key identifier is invalid or expired, or an incorrect secret is given, this function will return an unauthenticated error. Required permissions: - None |
| RenewAPIKeyToken | [RenewAPIKeyTokenRequest](#arangodb.cloud.iam.v1.RenewAPIKeyTokenRequest) | [RenewAPIKeyTokenResponse](#arangodb.cloud.iam.v1.RenewAPIKeyTokenResponse) | Renew a non-expired API key authentication token. This allows to extend the lifetime of a token created by AuthenticateAPIKey. If the given token is invalid or expired, or the underlying API key is expired this function will return an unauthenticated error. Required permissions: - None |
| RevokeAPIKeyToken | [RevokeAPIKeyTokenRequest](#arangodb.cloud.iam.v1.RevokeAPIKeyTokenRequest) | [.arangodb.cloud.common.v1.Empty](#arangodb.cloud.common.v1.Empty) | Revoke an API key authentication token. This function will return a non-error response, even if the given token is invalid or already expired. Required permissions: - None |

 



<a name="support/v1/support.proto"></a>
<p align="right"><a href="#top">Top</a></p>

## support/v1/support.proto



<a name="arangodb.cloud.support.v1.FaqGroup"></a>

### FaqGroup
FaqGroup contains groups of faq entries


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [string](#string) |  | ID of the FAQ Group |
| name | [string](#string) |  | Name of the FAQ Group |






<a name="arangodb.cloud.support.v1.FaqGroupEntry"></a>

### FaqGroupEntry
FaqGroupEntry contains entries for a group


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| question | [string](#string) |  | The question of this entry |
| answer | [string](#string) |  | The answer to the question in this entry |






<a name="arangodb.cloud.support.v1.FaqGroupEntryList"></a>

### FaqGroupEntryList
List of faq group entries.


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| items | [FaqGroupEntry](#arangodb.cloud.support.v1.FaqGroupEntry) | repeated |  |






<a name="arangodb.cloud.support.v1.FaqGroupList"></a>

### FaqGroupList
List of faq groups.


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| items | [FaqGroup](#arangodb.cloud.support.v1.FaqGroup) | repeated |  |






<a name="arangodb.cloud.support.v1.ListPlansRequest"></a>

### ListPlansRequest
Arguments for a ListPlans request


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| options | [arangodb.cloud.common.v1.ListOptions](#arangodb.cloud.common.v1.ListOptions) |  | Common list options |
| organization_id | [string](#string) |  | If set, list plans as they are available for the organization identified by this ID. |






<a name="arangodb.cloud.support.v1.Plan"></a>

### Plan
Plan represents a specific support plan such as Bronze, Silver or Gold.


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [string](#string) |  | System identifier of the plan. |
| name | [string](#string) |  | Name of the plan. |
| is_default | [bool](#bool) |  | If set, this plan is the default support plan. |
| description | [string](#string) |  | Human readable description of the plan |
| is_unavailable | [bool](#bool) |  | If set, this plan is shown, but not selectable. |
| first_response_times | [ResponseTimes](#arangodb.cloud.support.v1.ResponseTimes) |  | SLA times to first response for various situations. When this plan is unavailable, this field is optional. |






<a name="arangodb.cloud.support.v1.PlanList"></a>

### PlanList
List of plans.


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| items | [Plan](#arangodb.cloud.support.v1.Plan) | repeated |  |






<a name="arangodb.cloud.support.v1.ResponseTimes"></a>

### ResponseTimes
Response for various categories on situations.
All values are in minutes.
A value of 0 means &#34;best effort&#34;.


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| critical | [int32](#int32) |  | Response time for operation-impeding Error in a production environment. |
| high | [int32](#int32) |  | Response time for operation-limiting error. |
| normal | [int32](#int32) |  | Response time for minor error. |
| low | [int32](#int32) |  | Response time for usage question. |





 

 

 


<a name="arangodb.cloud.support.v1.SupportService"></a>

### SupportService
SupportService is the API used to query for support.

| Method Name | Request Type | Response Type | Description |
| ----------- | ------------ | ------------- | ------------|
| GetAPIVersion | [.arangodb.cloud.common.v1.Empty](#arangodb.cloud.common.v1.Empty) | [.arangodb.cloud.common.v1.Version](#arangodb.cloud.common.v1.Version) | Get the current API version of this service. Required permissions: - None |
| ListPlans | [ListPlansRequest](#arangodb.cloud.support.v1.ListPlansRequest) | [PlanList](#arangodb.cloud.support.v1.PlanList) | Fetch all support plans that are supported by the ArangoDB cloud. Required permissions: - None |
| GetPlan | [.arangodb.cloud.common.v1.IDOptions](#arangodb.cloud.common.v1.IDOptions) | [Plan](#arangodb.cloud.support.v1.Plan) | Fetch a support plan by its id. Required permissions: - None |
| ListFaqGroups | [.arangodb.cloud.common.v1.ListOptions](#arangodb.cloud.common.v1.ListOptions) | [FaqGroupList](#arangodb.cloud.support.v1.FaqGroupList) | Fetch all FAQ groups. Required permissions: - None |
| ListFaqGroupEntries | [.arangodb.cloud.common.v1.ListOptions](#arangodb.cloud.common.v1.ListOptions) | [FaqGroupEntryList](#arangodb.cloud.support.v1.FaqGroupEntryList) | Fetch all FAQ group entries of the FAQ group identified by the given context ID. Required permissions: - None |

 



<a name="backup/v1/backup.proto"></a>
<p align="right"><a href="#top">Top</a></p>

## backup/v1/backup.proto



<a name="arangodb.cloud.backup.v1.Backup"></a>

### Backup
Backup represents a single backup of a deployment.


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [string](#string) |  | System identifier of the backup. This is a read-only value. |
| url | [string](#string) |  | URL of this resource This is a read-only value. |
| name | [string](#string) |  | Name of the backup |
| description | [string](#string) |  | Description of the backup |
| deployment_id | [string](#string) |  | Identifier of the deployment that owns this backup. After creation, this value cannot be changed. |
| backup_policy_id | [string](#string) |  | Identifier of the backup policy that triggered this backup After creation, this value cannot be changed. If this field is empty, this is a manual backup |
| created_at | [google.protobuf.Timestamp](#google.protobuf.Timestamp) |  | The creation timestamp of the backup (database object) This is a read-only value. |
| deleted_at | [google.protobuf.Timestamp](#google.protobuf.Timestamp) |  | The deletion timestamp of the backup This is a read-only value. |
| is_deleted | [bool](#bool) |  | Set when this backup is deleted. This is a read-only value. |
| auto_deleted_at | [google.protobuf.Timestamp](#google.protobuf.Timestamp) |  | The timestamp that this backup will be automatically removed You cannot provide a value in the past, If the field is not set, the backup will not be automatically removed. |
| deployment_info | [Backup.DeploymentInfo](#arangodb.cloud.backup.v1.Backup.DeploymentInfo) |  | Information about the deployment during backup |
| upload | [bool](#bool) |  | Upload the backup, created by the backup policy, to an external source. Setting or unsetting this fields after the backup has been created will upload/delete the backup from the external source. Setting this field when status.available = false will result in an error |
| upload_updated_at | [google.protobuf.Timestamp](#google.protobuf.Timestamp) |  | The timestamp of when the upload boolean has been updated. This is a read-only value. |
| download | [Backup.DownloadSpec](#arangodb.cloud.backup.v1.Backup.DownloadSpec) |  | Information about a backup download. If this field is set the backup will be downloaded the deployment. This is a read-only field. To set this field please use the DownloadBackup method. |
| status | [Backup.Status](#arangodb.cloud.backup.v1.Backup.Status) |  | Status of the actual backup |






<a name="arangodb.cloud.backup.v1.Backup.DeploymentInfo"></a>

### Backup.DeploymentInfo
Information about the deployment during backup 
All members of this field are read-only.


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| version | [string](#string) |  | ArangoDB version of the deployment during backup. |
| servers | [arangodb.cloud.data.v1.Deployment.ServersSpec](#arangodb.cloud.data.v1.Deployment.ServersSpec) |  | Servers spec of the deployment during backup. |






<a name="arangodb.cloud.backup.v1.Backup.DownloadSpec"></a>

### Backup.DownloadSpec
Information about a backup download.
All members of this message are read-only.


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| revision | [int32](#int32) |  | The revision of this DownloadSpec |
| last_updated_at | [google.protobuf.Timestamp](#google.protobuf.Timestamp) |  | The timestamp of when the last revision has been updated. |






<a name="arangodb.cloud.backup.v1.Backup.DownloadStatus"></a>

### Backup.DownloadStatus
The status of backup download
All members of this message are read-only.


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| revision | [int32](#int32) |  | The revision of the used DownloadStatus |
| downloaded | [bool](#bool) |  | Set when the backup has been fully downloaded |
| downloaded_at | [google.protobuf.Timestamp](#google.protobuf.Timestamp) |  | The timestamp of when the backup has been fully downloaded. |






<a name="arangodb.cloud.backup.v1.Backup.Status"></a>

### Backup.Status
Status of the actual backup
All members of this field are read-only.


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| created_at | [google.protobuf.Timestamp](#google.protobuf.Timestamp) |  | The creation timestamp of the backup |
| version | [string](#string) |  | ArangoDB version of the backup |
| state | [string](#string) |  | The state of the backup Will be one of the following: &#34;Pending|Unavailable|Scheduled|Download|DownloadError|Downloading|Create|Upload|Uploading|UploadError|Ready|Deleted|Failed&#34; |
| is_failed | [bool](#bool) |  | Set when the backup is failed |
| message | [string](#string) |  | State message |
| progress | [string](#string) |  | Progress of the backup (upload or download) |
| size_bytes | [int64](#int64) |  | Size of the backup (in bytes) |
| available | [bool](#bool) |  | If set the backup is available on the cluster and can be restored |
| dbservers | [int32](#int32) |  | Number of dbservers of the deployment during backup |
| upload_only | [bool](#bool) |  | Indicates that the backup is available in the external source only. You should download the backup before you can restore it. |
| upload_status | [Backup.UploadStatus](#arangodb.cloud.backup.v1.Backup.UploadStatus) |  | The status of backup upload (if applicable). |
| download_status | [Backup.DownloadStatus](#arangodb.cloud.backup.v1.Backup.DownloadStatus) |  | The status of backup download (if applicable). This field will be set to empty if a new revision of the spec is available |






<a name="arangodb.cloud.backup.v1.Backup.UploadStatus"></a>

### Backup.UploadStatus
The status of backup upload
All members of this message are read-only.


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| uploaded | [bool](#bool) |  | Set when the backup has been fully uploaded |
| uploaded_at | [google.protobuf.Timestamp](#google.protobuf.Timestamp) |  | The timestamp of when the backup has been fully uploaded |
| size_bytes | [int64](#int64) |  | Size of the backup in the external source (in bytes) |






<a name="arangodb.cloud.backup.v1.BackupList"></a>

### BackupList
List of backups.


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| items | [Backup](#arangodb.cloud.backup.v1.Backup) | repeated |  |
| budget | [arangodb.cloud.common.v1.Budget](#arangodb.cloud.common.v1.Budget) |  | Budget for backups |






<a name="arangodb.cloud.backup.v1.BackupPolicy"></a>

### BackupPolicy
BackupPolicy represents a single backup policy for a deployment.


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [string](#string) |  | System identifier of the backup policy. This is a read-only value. |
| url | [string](#string) |  | URL of this resource This is a read-only value. |
| name | [string](#string) |  | Name of the backup policy |
| description | [string](#string) |  | Description of the backup policy |
| deployment_id | [string](#string) |  | Identifier of the deployment that owns this backup policy. After creation, this value cannot be changed. |
| created_at | [google.protobuf.Timestamp](#google.protobuf.Timestamp) |  | The creation timestamp of the backup policy This is a read-only value. |
| deleted_at | [google.protobuf.Timestamp](#google.protobuf.Timestamp) |  | The deletion timestamp of the backup policy This is a read-only value. |
| is_deleted | [bool](#bool) |  | Set when this backup policy is deleted. This is a read-only value. |
| is_paused | [bool](#bool) |  | Pause this backup policy. If a backup policy is paused, the backup policy will not result in new backups. The backup policy isn&#39;t deleted, unsetting this field will resume the creation of backups again. |
| schedule | [BackupPolicy.Schedule](#arangodb.cloud.backup.v1.BackupPolicy.Schedule) |  | The schedule for this backup policy |
| upload | [bool](#bool) |  | Upload the backup, created by the backup policy, to an external source. |
| retention_period | [google.protobuf.Duration](#google.protobuf.Duration) |  | Backups created by this policy will be automatically deleted after the specified retention period A value of 0 means that backup will never be deleted. |
| email_notification | [string](#string) |  | The owners of the organization can be notified by email This field support the following values: &#34;None|FailureOnly|Always&#34; |
| status | [BackupPolicy.Status](#arangodb.cloud.backup.v1.BackupPolicy.Status) |  | Status of the backup policy |






<a name="arangodb.cloud.backup.v1.BackupPolicy.DailySchedule"></a>

### BackupPolicy.DailySchedule
Note: Nested types inside nested types is not supported by the typescript generator


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| monday | [bool](#bool) |  | If set, a backup will be created on Mondays. |
| tuesday | [bool](#bool) |  | If set, a backup will be created on Tuesdays. |
| wednesday | [bool](#bool) |  | If set, a backup will be created on Wednesdays. |
| thursday | [bool](#bool) |  | If set, a backup will be created on Thursdays. |
| friday | [bool](#bool) |  | If set, a backup will be created on Fridays. |
| saturday | [bool](#bool) |  | If set, a backup will be created on Saturdays. |
| sunday | [bool](#bool) |  | If set, a backup will be created on Sundays. |
| schedule_at | [TimeOfDay](#arangodb.cloud.backup.v1.TimeOfDay) |  | The (target) time of the schedule |






<a name="arangodb.cloud.backup.v1.BackupPolicy.HourlySchedule"></a>

### BackupPolicy.HourlySchedule
Note: Nested types inside nested types is not supported by the typescript generator


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| schedule_every_interval_hours | [int32](#int32) |  | Schedule should run with an interval of the specified hours (1-23) |






<a name="arangodb.cloud.backup.v1.BackupPolicy.MonthlySchedule"></a>

### BackupPolicy.MonthlySchedule
Note: Nested types inside nested types is not supported by the typescript generator


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| day_of_month | [int32](#int32) |  | Run the backup on the specified day of the month (1-31) Note: Specifying a number larger than some months have days will result in no backup for those months (e.g. 29 for February (unless leap year)). |
| schedule_at | [TimeOfDay](#arangodb.cloud.backup.v1.TimeOfDay) |  | The (target) time of the schedule |






<a name="arangodb.cloud.backup.v1.BackupPolicy.Schedule"></a>

### BackupPolicy.Schedule



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| schedule_type | [string](#string) |  | Schedule type should be one of the following string: &#34;Hourly|Daily|Monthly&#34; The schedule_hourly, schedule_daily or schedule_montly field should be set Setting multiple fields, or inconsistent with this field result in an error during create/update |
| hourly_schedule | [BackupPolicy.HourlySchedule](#arangodb.cloud.backup.v1.BackupPolicy.HourlySchedule) |  | Schedule applies to the selected day of the week This is applicable for Hourly type only, ignored for Daily and Monthly |
| daily_schedule | [BackupPolicy.DailySchedule](#arangodb.cloud.backup.v1.BackupPolicy.DailySchedule) |  | Schedule applies to the selected day of the week This is applicable for Daily type only, ignored for Hourly and Monthly |
| monthly_schedule | [BackupPolicy.MonthlySchedule](#arangodb.cloud.backup.v1.BackupPolicy.MonthlySchedule) |  | Schedule applies to the selected day of the month This is applicable for Monthly type only, ignored for Hourly and Daily |






<a name="arangodb.cloud.backup.v1.BackupPolicy.Status"></a>

### BackupPolicy.Status
Status of the backup policy
All members of this field are read-only.


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| next_backup | [google.protobuf.Timestamp](#google.protobuf.Timestamp) |  | The timestamp when the next backup - initiated by this backup policy - will be created |
| message | [string](#string) |  | Message in case of failure, otherwise an empty string |






<a name="arangodb.cloud.backup.v1.BackupPolicyList"></a>

### BackupPolicyList
List of backup policies.


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| items | [BackupPolicy](#arangodb.cloud.backup.v1.BackupPolicy) | repeated |  |






<a name="arangodb.cloud.backup.v1.ListBackupPoliciesRequest"></a>

### ListBackupPoliciesRequest
Request arguments for ListBackupPolicies


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| deployment_id | [string](#string) |  | Identifier of the deployment to request the backup policies for. |
| include_deleted | [bool](#bool) |  | If set, the result includes all backup policies, including those who set to deleted, however are not removed from the system currently. If not set, only backup policies not indicated as deleted are returned. |
| options | [arangodb.cloud.common.v1.ListOptions](#arangodb.cloud.common.v1.ListOptions) |  | Optional common list options, the context_id is ignored |






<a name="arangodb.cloud.backup.v1.ListBackupsRequest"></a>

### ListBackupsRequest
Request arguments for ListBackups


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| deployment_id | [string](#string) |  | Identifier of the deployment to request the backups for. |
| from | [google.protobuf.Timestamp](#google.protobuf.Timestamp) |  | Request backups that are created at or after this timestamp. This is an optional field. |
| to | [google.protobuf.Timestamp](#google.protobuf.Timestamp) |  | Request backups that are created before this timestamp. This is an optional field. |
| options | [arangodb.cloud.common.v1.ListOptions](#arangodb.cloud.common.v1.ListOptions) |  | Optional common list options, the context_id is ignored |






<a name="arangodb.cloud.backup.v1.TimeOfDay"></a>

### TimeOfDay
TimeOfDay describes a specific moment on a day


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| hours | [int32](#int32) |  | Hours part of the time of day (0-23) |
| minutes | [int32](#int32) |  | Minutes part of the time of day (0-59) |
| time_zone | [string](#string) |  | The time-zone this time of day applies to (empty means UTC) Names MUST be exactly as defined in RFC-822. |





 

 

 


<a name="arangodb.cloud.backup.v1.BackupService"></a>

### BackupService
BackupService is the API used to configure backup objects.

| Method Name | Request Type | Response Type | Description |
| ----------- | ------------ | ------------- | ------------|
| GetAPIVersion | [.arangodb.cloud.common.v1.Empty](#arangodb.cloud.common.v1.Empty) | [.arangodb.cloud.common.v1.Version](#arangodb.cloud.common.v1.Version) | Get the current API version of this service. Required permissions: - None |
| IsBackupFeatureAvailable | [.arangodb.cloud.common.v1.IDOptions](#arangodb.cloud.common.v1.IDOptions) | [.arangodb.cloud.common.v1.YesOrNo](#arangodb.cloud.common.v1.YesOrNo) | Checks if the backup feature is enabled and available for a specific deployment. Required permissions: - backup.feature.get on the deployment that is identified by the given ID. |
| IsBackupUploadFeatureAvailable | [.arangodb.cloud.common.v1.IDOptions](#arangodb.cloud.common.v1.IDOptions) | [.arangodb.cloud.common.v1.YesOrNo](#arangodb.cloud.common.v1.YesOrNo) | Checks if the backup upload feature is enabled for a specific deployment. Required permissions: - backup.feature.get on the deployment that is identified by the given ID. |
| ListBackupPolicies | [ListBackupPoliciesRequest](#arangodb.cloud.backup.v1.ListBackupPoliciesRequest) | [BackupPolicyList](#arangodb.cloud.backup.v1.BackupPolicyList) | Fetch all backup policies for a specific deployment. Required permissions: - backup.backuppolicy.list on the deployment that owns the backup policies and is identified by the given ID. |
| GetBackupPolicy | [.arangodb.cloud.common.v1.IDOptions](#arangodb.cloud.common.v1.IDOptions) | [BackupPolicy](#arangodb.cloud.backup.v1.BackupPolicy) | Fetch a backup policy identified by the given ID. Required permissions: - backup.backuppolicy.get on the backup policy identified by the given ID. |
| CreateBackupPolicy | [BackupPolicy](#arangodb.cloud.backup.v1.BackupPolicy) | [BackupPolicy](#arangodb.cloud.backup.v1.BackupPolicy) | Create a new backup policy Required permissions: - backup.backuppolicy.create on the deployment that owns the backup policy and is identified by the given ID. |
| UpdateBackupPolicy | [BackupPolicy](#arangodb.cloud.backup.v1.BackupPolicy) | [BackupPolicy](#arangodb.cloud.backup.v1.BackupPolicy) | Update a backup policy Required permissions: - backup.backuppolicy.update on the backup policy identified by the given ID. |
| DeleteBackupPolicy | [.arangodb.cloud.common.v1.IDOptions](#arangodb.cloud.common.v1.IDOptions) | [.arangodb.cloud.common.v1.Empty](#arangodb.cloud.common.v1.Empty) | Delete a backup policy identified by the given ID. Note that the backup policy are initially only marked for deletion, no backups will be deleted with this operation. Once all their dependent backups are removed, the backup policy is removed. Required permissions: - backup.backuppolicy.delete on the backup policy identified by the given ID. |
| ListBackups | [ListBackupsRequest](#arangodb.cloud.backup.v1.ListBackupsRequest) | [BackupList](#arangodb.cloud.backup.v1.BackupList) | Fetch all backups for a specific deployment. Required permissions: - backup.backup.list on the deployment that owns the backup and is identified by the given ID. |
| GetBackup | [.arangodb.cloud.common.v1.IDOptions](#arangodb.cloud.common.v1.IDOptions) | [Backup](#arangodb.cloud.backup.v1.Backup) | Fetch a backup identified by the given ID. Required permissions: - backup.backup.get on the backup identified by the given ID. |
| CreateBackup | [Backup](#arangodb.cloud.backup.v1.Backup) | [Backup](#arangodb.cloud.backup.v1.Backup) | Create a new manual backup Setting the backup_policy_id field in the backup is not allowed Required permissions: - backup.backup.create on the deployment that owns the backup and is identified by the given ID. |
| UpdateBackup | [Backup](#arangodb.cloud.backup.v1.Backup) | [Backup](#arangodb.cloud.backup.v1.Backup) | Update a backup Required permissions: - backup.backup.update on the backup identified by the given ID. |
| DownloadBackup | [.arangodb.cloud.common.v1.IDOptions](#arangodb.cloud.common.v1.IDOptions) | [.arangodb.cloud.common.v1.Empty](#arangodb.cloud.common.v1.Empty) | Download a backup identified by the given ID from remote storage to the volumes of the servers of the deployment. This operation can only be executed on backups which have the same number of DB Servers in the backup and the current running cluster. If this backup was already downloaded, another download will be done. If the backup is still available on the cluster there is no need to explicitly download the backup before restoring. This function will return immediately. To track status, please invoke GetBackup and check the .status field inside the returned backup object Required permissions: - backup.backup.download on the backup identified by the given ID. |
| RestoreBackup | [.arangodb.cloud.common.v1.IDOptions](#arangodb.cloud.common.v1.IDOptions) | [.arangodb.cloud.common.v1.Empty](#arangodb.cloud.common.v1.Empty) | Restore (or recover) a backup identified by the given ID This operation can only be executed on backups where status.available is set and the mayor and minor version of the backup and the current running cluster are the same. This function will return immediately. To track status, please invoke GetDeployment on the data API and check the .status.restoring_backup and .status.restore_backup_status fields inside the returned deployment object Required permissions (both are needed): - backup.backup.restore on the backup identified by the given ID. - data.deployment.restore-backup on the deployment that owns this backup |
| DeleteBackup | [.arangodb.cloud.common.v1.IDOptions](#arangodb.cloud.common.v1.IDOptions) | [.arangodb.cloud.common.v1.Empty](#arangodb.cloud.common.v1.Empty) | Delete a backup identified by the given ID, after which removal of any remote storage of the backup is started. Note that the backup are initially only marked for deletion. Once all remote storage for the backup has been removed, the backup itself is removed. Required permissions: - backup.backup.delete on the backup identified by the given ID. |

 



<a name="data/v1/data.proto"></a>
<p align="right"><a href="#top">Top</a></p>

## data/v1/data.proto



<a name="arangodb.cloud.data.v1.CPUSize"></a>

### CPUSize
CPUSize specifies the a specific level of CPU for a node.


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [string](#string) |  | System identifier of the size (e.g. standard) |
| name | [string](#string) |  | Human readable name of the size (e.g. Standard) |






<a name="arangodb.cloud.data.v1.CPUSizeList"></a>

### CPUSizeList
List of CPU sizes.


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| items | [CPUSize](#arangodb.cloud.data.v1.CPUSize) | repeated |  |






<a name="arangodb.cloud.data.v1.CalculateDeploymentSizeRequest"></a>

### CalculateDeploymentSizeRequest
Request arguments for CalculateDeploymentSize


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| coordinators | [int32](#int32) |  | Number of coordinators of the deployment This field is ignored unless model is &#34;flexible&#34;. |
| coordinator_memory_size | [int32](#int32) |  | Amount of memory (in GB) to allocate for each coordinator. This field is ignored unless model is &#34;flexible&#34;. |
| dbservers | [int32](#int32) |  | Number of dbservers of the deployment This field is ignored unless model is &#34;flexible&#34;. |
| dbserver_memory_size | [int32](#int32) |  | Amount of memory (in GB) to allocate for each dbserver. This field is ignored unless model is &#34;flexible&#34;. |
| dbserver_disk_size | [int32](#int32) |  | Amount of disk space (in GB) to allocate for each dbserver. This field is ignored unless model is &#34;flexible&#34;. |
| model | [string](#string) |  | Type of model being used |
| node_size_id | [string](#string) |  | Size of nodes being used |
| node_count | [int32](#int32) |  | Number of nodes being used |
| node_disk_size | [int32](#int32) |  | Amount of disk space per node (in GB) |






<a name="arangodb.cloud.data.v1.ConnectDriverInstructions"></a>

### ConnectDriverInstructions
Instructions for connecting a driver to a deployment


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| drivers | [ConnectDriverInstructions.DriverInstructions](#arangodb.cloud.data.v1.ConnectDriverInstructions.DriverInstructions) | repeated | Per driver instructions for connecting to a deployment |






<a name="arangodb.cloud.data.v1.ConnectDriverInstructions.DriverInstructions"></a>

### ConnectDriverInstructions.DriverInstructions
Instructions for a specific driver


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| name | [string](#string) |  | Human readable name of the driver. E.g. &#34;ArangoDB Go driver&#34; |
| code | [string](#string) | repeated | Lines of code |
| remarks | [string](#string) | repeated | Human readable remarks |
| driver_url | [string](#string) |  | URL for getting more information on the driver. |






<a name="arangodb.cloud.data.v1.DataVolumeInfo"></a>

### DataVolumeInfo
DataVolumeInfo provides information about a data volume


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| total_bytes | [int64](#int64) |  | The total number of bytes of the data volume. |
| used_bytes | [int64](#int64) |  | The number of bytes used on the data volume. |
| available_bytes | [int64](#int64) |  | The number of bytes available on the data volume. |
| measured_at | [google.protobuf.Timestamp](#google.protobuf.Timestamp) |  | When this info has been measused |






<a name="arangodb.cloud.data.v1.Deployment"></a>

### Deployment
A Deployment is represents one deployment of an ArangoDB cluster.


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [string](#string) |  | System identifier of the deployment. This is a read-only value. |
| url | [string](#string) |  | URL of this resource This is a read-only value. |
| name | [string](#string) |  | Name of the deployment |
| description | [string](#string) |  | Description of the deployment |
| project_id | [string](#string) |  | Identifier of the project that owns this deployment. After creation, this value cannot be changed. |
| region_id | [string](#string) |  | Identifier of the region in which the deployment is created. After creation, this value cannot be changed. |
| created_at | [google.protobuf.Timestamp](#google.protobuf.Timestamp) |  | The creation timestamp of the deployment This is a read-only value. |
| deleted_at | [google.protobuf.Timestamp](#google.protobuf.Timestamp) |  | The deletion timestamp of the deployment This is a read-only value. |
| is_deleted | [bool](#bool) |  | Set when this deployment is deleted. This is a read-only value. |
| support_plan_id | [string](#string) |  | Optional identifier of the support plan selected for this deployment. After creation, this value cannot be changed. If no support plan identifier is set, the default support plan is used. |
| created_by_id | [string](#string) |  | Identifier of the user who created this deployment. This is a read-only value. |
| accepted_terms_and_conditions_id | [string](#string) |  | This field must be set to the identifier of the current Terms&amp;Conditions when creating a deployment. If the tier of the organization does not require a non-empty Terms&amp;Condition identifier, this field may be left empty. This is a read-only value after creation. |
| version | [string](#string) |  | ArangoDB version to use for this deployment. See Version.version. If you change this value to a higher version, the deployment will be upgraded. If you change this value to a lower patch value, the deployment will be downgraded. Any attempt to change to a lower minor or major version is considered an invalid request. Any attempt to change to a version that is not in the list of available versions is considered an invalid request. |
| certificates | [Deployment.CertificateSpec](#arangodb.cloud.data.v1.Deployment.CertificateSpec) |  |  |
| servers | [Deployment.ServersSpec](#arangodb.cloud.data.v1.Deployment.ServersSpec) |  |  |
| ipwhitelist_id | [string](#string) |  | Optional identifier of IP whitelist to use for this deployment. |
| model | [Deployment.ModelSpec](#arangodb.cloud.data.v1.Deployment.ModelSpec) |  |  |
| custom_image | [string](#string) |  | If provided, dataclusterd will use this custom image tag instead of the configured one for a given version. Further, ImagePullPolicy will be set to Always. This field can only be set by selected organizations. |
| status | [Deployment.Status](#arangodb.cloud.data.v1.Deployment.Status) |  |  |
| size | [DeploymentSize](#arangodb.cloud.data.v1.DeploymentSize) |  | Detailed size of the deployment This is a read-only field. |
| expiration | [Deployment.Expiration](#arangodb.cloud.data.v1.Deployment.Expiration) |  |  |
| backup_restore | [Deployment.BackupRestoreSpec](#arangodb.cloud.data.v1.Deployment.BackupRestoreSpec) |  | Information about a backup restore. If this field is set the deployment will be restored to that backup. This is a read-only field. To set this field please use the backup service RestoreBackup method. |
| deployment_recommendations | [DeploymentSizeRecommendation](#arangodb.cloud.data.v1.DeploymentSizeRecommendation) | repeated | Recommendations made for deployments using the &#34;oneshard&#34; or &#34;sharded&#34; model. |






<a name="arangodb.cloud.data.v1.Deployment.BackupRestoreSpec"></a>

### Deployment.BackupRestoreSpec
Information about a backup restore.
All members of this message are read-only.


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| revision | [int32](#int32) |  | The revision of this BackupRestoreSpec |
| last_updated_at | [google.protobuf.Timestamp](#google.protobuf.Timestamp) |  | The timestamp of when the last revision has been updated. |
| backup_id | [string](#string) |  | Identifier of a backup to restore to. |






<a name="arangodb.cloud.data.v1.Deployment.BackupRestoreStatus"></a>

### Deployment.BackupRestoreStatus
The status of backup restore
All members of this message are read-only.


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| revision | [int32](#int32) |  | The revision of the used BackupRestoreSpec |
| restoring | [bool](#bool) |  | Set if the deployment is preparing or restoring a backup |
| status | [string](#string) |  | Status of the restore backup operation. Enum of the following values: &#34;&lt;empty&gt;|Preparing|Restoring|Restored|Failed&#34; |
| failure_reason | [string](#string) |  | Failure reason of the backup restore (if applicable) |






<a name="arangodb.cloud.data.v1.Deployment.CertificateSpec"></a>

### Deployment.CertificateSpec



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| ca_certificate_id | [string](#string) |  | Identifier of the CACertificate used to sign TLS certificates for the deployment. If you change this value after the creation of the deployment a complete rotation of the deployment is required, which will result in some downtime. |
| alternate_dns_names | [string](#string) | repeated | Zero or more DNS names to include in the TLS certificate of the deployment. |






<a name="arangodb.cloud.data.v1.Deployment.Expiration"></a>

### Deployment.Expiration
Expiration of the deployment.
All members of this message are read-only.


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| expires_at | [google.protobuf.Timestamp](#google.protobuf.Timestamp) |  | The expiration timestamp of the deployment If not set, the deployment will not expire. |
| reason | [string](#string) |  | Human readable reason for why the deployment expires (or does not expire). |
| last_warning_email_send_at | [google.protobuf.Timestamp](#google.protobuf.Timestamp) |  | The timestamp of when the last &#34;this deployment will expire at&#34; email was send. If not set, no such email has been send. |
| last_warning_email_send_to | [string](#string) | repeated | List of email addresses to which the last warning email has been send. Not set when no such email has been send. |






<a name="arangodb.cloud.data.v1.Deployment.ModelSpec"></a>

### Deployment.ModelSpec



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| model | [string](#string) |  | Type of model being used |
| node_size_id | [string](#string) |  | Size of nodes being used |
| node_count | [int32](#int32) |  | Number of nodes being used |
| node_disk_size | [int32](#int32) |  | Amount of disk space per node (in GB) |






<a name="arangodb.cloud.data.v1.Deployment.ServerStatus"></a>

### Deployment.ServerStatus
Status of a single server (of the ArangoDB cluster)


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [string](#string) |  | ID of the server |
| type | [string](#string) |  | Type of server (agent|coordinator|dbserver) |
| description | [string](#string) |  | Human readable description of the status of the deployment. |
| created_at | [google.protobuf.Timestamp](#google.protobuf.Timestamp) |  | The creation timestamp of the server |
| ready | [bool](#bool) |  | Set once the server is ready |
| member_of_cluster | [bool](#bool) |  | Set once the server has been known to be a member of the cluster |
| failed | [bool](#bool) |  | Set if the server is in a failed state Every server is always in 1 (and only 1) of these state: failed/creating/ok/upgrading. |
| creating | [bool](#bool) |  | Set if the server is still being created Every server is always in 1 (and only 1) of these state: failed/creating/ok/upgrading. |
| ok | [bool](#bool) |  | Set if the server is in the ok state. Every server is always in 1 (and only 1) of these state: failed/creating/ok/upgrading. |
| upgrading | [bool](#bool) |  | Set if the server is still being upgraded Every server is always in 1 (and only 1) of these state: failed/creating/ok/upgrading. |
| version | [string](#string) |  | Latest known ArangoDB version used by this server. Initially this field is empty. |
| data_volume_info | [DataVolumeInfo](#arangodb.cloud.data.v1.DataVolumeInfo) |  | Information about the data volume used to store the data |






<a name="arangodb.cloud.data.v1.Deployment.ServersSpec"></a>

### Deployment.ServersSpec



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| coordinators | [int32](#int32) |  | Number of coordinators of the deployment This field is automatically set unless the flexible model is used. |
| coordinator_memory_size | [int32](#int32) |  | Amount of memory (in GB) to allocate for coordinators. This field is automatically set unless the flexible model is used. |
| coordinator_args | [string](#string) | repeated | Custom command line arguments passed to all coordinators. This field is ignored set unless the flexible model is used. |
| dbservers | [int32](#int32) |  | Number of dbservers of the deployment This field is automatically set unless the flexible model is used. |
| dbserver_memory_size | [int32](#int32) |  | Amount of memory (in GB) to allocate for dbservers. This field is automatically set unless the flexible model is used. |
| dbserver_disk_size | [int32](#int32) |  | Amount of disk space (in GB) to allocate for dbservers. This field is automatically set unless the flexible model is used. |
| dbserver_args | [string](#string) | repeated | Custom command line arguments passed to all dbservers. This field is ignored set unless the flexible model is used. |






<a name="arangodb.cloud.data.v1.Deployment.Status"></a>

### Deployment.Status
Status of the deployment
All members of this field are read-only.


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| endpoint | [string](#string) |  | Endpoint URL used to reach the deployment This value will be empty during the creation of the deployment. |
| description | [string](#string) |  | Human readable description of the status of the deployment. |
| created | [bool](#bool) |  | Set once the deployment has been created. |
| ready | [bool](#bool) |  | Set if the deployment is ready to be used. If the deployment has downtime (e.g. because of changing a CA certificate) this will go to false until the downtime is over. |
| upgrading | [bool](#bool) |  | Set if the deployment is being upgraded. |
| server_versions | [string](#string) | repeated | Versions of running servers |
| servers | [Deployment.ServerStatus](#arangodb.cloud.data.v1.Deployment.ServerStatus) | repeated | Status of individual servers of the deployment |
| bootstrapped_at | [google.protobuf.Timestamp](#google.protobuf.Timestamp) |  | Set if the ready boolean is transitioned to true for the very first time. |
| bootstrapped | [bool](#bool) |  | Set if bootstrapped_at has a value, otherwise false. |
| backup_restore_status | [Deployment.BackupRestoreStatus](#arangodb.cloud.data.v1.Deployment.BackupRestoreStatus) |  | The status of backup restore (if applicable). This field will be set to empty if a new revision of the spec is available |
| total_backup_size_bytes | [int64](#int64) |  | The total size of all backups in the external source (in bytes) |
| backup_upload_in_progress | [bool](#bool) |  | Set if there is any backup currently uploading data to the external source |






<a name="arangodb.cloud.data.v1.DeploymentCredentials"></a>

### DeploymentCredentials
Result for GetDeploymentCredentials


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| username | [string](#string) |  | Name of the user for which credentials were asked. Default to username of root user. |
| password | [string](#string) |  | Password of the user for which credentials were asked. |






<a name="arangodb.cloud.data.v1.DeploymentCredentialsRequest"></a>

### DeploymentCredentialsRequest
Request arguments for GetDeploymentCredentials


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| deployment_id | [string](#string) |  | Identifier of deployment to request credentials for. |






<a name="arangodb.cloud.data.v1.DeploymentList"></a>

### DeploymentList
List of Deployments.


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| items | [Deployment](#arangodb.cloud.data.v1.Deployment) | repeated | Actual deployments |
| budget | [arangodb.cloud.common.v1.Budget](#arangodb.cloud.common.v1.Budget) |  | Budget for deployments |






<a name="arangodb.cloud.data.v1.DeploymentModel"></a>

### DeploymentModel
DeploymentModel specifies the a specific model of deploying
arangodb clusters.


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [string](#string) |  | System identifier of the model (e.g. oneshard) |
| name | [string](#string) |  | Human readable name of the model (e.g. One shard) |






<a name="arangodb.cloud.data.v1.DeploymentModelList"></a>

### DeploymentModelList
List of deployment models.


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| items | [DeploymentModel](#arangodb.cloud.data.v1.DeploymentModel) | repeated |  |






<a name="arangodb.cloud.data.v1.DeploymentPrice"></a>

### DeploymentPrice



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| price_per_hour | [float](#float) |  | Price per hour in given currency for the deployment. |
| network_transfer_prices | [DeploymentPrice.NetworkTransferPrice](#arangodb.cloud.data.v1.DeploymentPrice.NetworkTransferPrice) | repeated | Network transfer prices (variable depending on usage) |
| backup_price | [DeploymentPrice.BackupPrice](#arangodb.cloud.data.v1.DeploymentPrice.BackupPrice) |  | Network transfer prices (variable depending on usage) |
| currency_id | [string](#string) |  | Identifier of the currency in which the price is specified. |






<a name="arangodb.cloud.data.v1.DeploymentPrice.BackupPrice"></a>

### DeploymentPrice.BackupPrice



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| price_per_gb_per_hour | [float](#float) |  | Price per GB/hour of uploaded backup storage |






<a name="arangodb.cloud.data.v1.DeploymentPrice.NetworkTransferPrice"></a>

### DeploymentPrice.NetworkTransferPrice



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| ingress_price_per_gb | [float](#float) |  | Price per GB of network transfer into the database |
| egress_price_per_gb | [float](#float) |  | Price per GB of network transfer out of the database |
| description | [string](#string) |  | Description of this price |






<a name="arangodb.cloud.data.v1.DeploymentPriceRequest"></a>

### DeploymentPriceRequest
Arguments for requesting a price a deployment of given properties.


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| organization_id | [string](#string) |  | Identifier of organization containing the deployment. |
| project_id | [string](#string) |  | Identifier of project containing the deployment. |
| support_plan_id | [string](#string) |  | Identifier of the support plan of the deployment. |
| cloud_provider_id | [string](#string) |  | Identifier of the cloud provider of the deployment. |
| cloud_region_id | [string](#string) |  | Identifier of the cloud region of the deployment. |
| model | [string](#string) |  | Model of the deployment. |
| node_size_id | [string](#string) |  | Node size use for deployments |
| node_count | [int32](#int32) |  | Number of nodes being used This field is ignored if model is &#34;flexible&#34;. |
| node_disk_size | [int32](#int32) |  | Amount of disk space per node (in GB) This field is ignored if model is &#34;flexible&#34;. |
| coordinators | [int32](#int32) |  | Number of coordinators of the deployment This field is ignored unless model is &#34;flexible&#34;. |
| coordinator_memory_size | [int32](#int32) |  | Amount of memory (in GB) to allocate for each coordinator. This field is ignored unless model is &#34;flexible&#34;. |
| dbservers | [int32](#int32) |  | Number of dbservers of the deployment This field is ignored unless model is &#34;flexible&#34;. |
| dbserver_memory_size | [int32](#int32) |  | Amount of memory (in GB) to allocate for each dbserver. This field is ignored unless model is &#34;flexible&#34;. |
| dbserver_disk_size | [int32](#int32) |  | Amount of disk space (in GB) to allocate for each dbserver. This field is ignored unless model is &#34;flexible&#34;. |






<a name="arangodb.cloud.data.v1.DeploymentSize"></a>

### DeploymentSize
Result of CalculateDeploymentSize


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| agents | [int32](#int32) |  | Number of agents |
| agent_memory_size | [int32](#int32) |  | Amount of memory (in GB) to allocate for each agent. |
| agent_disk_size | [int32](#int32) |  | Amount of disk space (in GB) to allocate for each agent. |
| total_memory_size | [int32](#int32) |  | Total (combined) amount of memory (in GB) used by all servers (agents, coordinators &amp; dbservers) |
| total_disk_size | [int32](#int32) |  | Total (combined) amount of disk space (in GB) used by all servers (agents &amp; dbservers) |






<a name="arangodb.cloud.data.v1.DeploymentSizeRecommendation"></a>

### DeploymentSizeRecommendation
Response of RecommendDeploymentSize.


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| request | [DeploymentSizeRequest](#arangodb.cloud.data.v1.DeploymentSizeRequest) |  | Request that resulted in this recommendation. |
| created_at | [google.protobuf.Timestamp](#google.protobuf.Timestamp) |  | Time when the recommendation was made. |
| node_memory_size | [int32](#int32) |  | Amount of memory space per node (in GB) being recommended |
| node_disk_size | [int32](#int32) |  | Amount of disk space per node (in GB) being recommended |
| node_count | [int32](#int32) |  | Number of nodes being recommended |
| exceeds_quota | [bool](#bool) |  | If set, this recommendation does not fit in the callers quota. |
| exceeds_platform | [bool](#bool) |  | If set, this recommendation does not fit in the Oasis platform. |






<a name="arangodb.cloud.data.v1.DeploymentSizeRequest"></a>

### DeploymentSizeRequest
Request arguments for RecommendDeploymentSize.


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| dataset_size | [int32](#int32) |  | Size of entire dataset (on disk) in GB. Required field. Must be &gt;= 1. |
| usecase | [string](#string) |  | Primary use case for the database Possible values: - GRAPH - DOCUMENT - MULTIMODEL - KEYVALUE |
| model | [string](#string) |  | Customer preferred model |
| file_format | [string](#string) |  | File format on dataset Possible values: - JSON - CSV |
| number_of_documents | [int64](#int64) |  | Number of documents in the entire dataset (in case of JSON). Number of rows in the entire dataset (in case of CSV). |
| number_of_columns | [int32](#int32) |  | Largest number of columns of the dataset (in case of CSV). |
| working_set_percentage | [float](#float) |  | Percentage of dataset_size that is considered &#34;hot&#34; Must be &gt;= 0.0 and &lt;= 1.0 |
| access_read_percentage | [float](#float) |  | Percentage of operations that are READ Must be &gt;= 0.0 and &lt;= 1.0 |
| access_create_percentage | [float](#float) |  | Percentage of operations that are CREATE Must be &gt;= 0.0 and &lt;= 1.0 |
| access_update_percentage | [float](#float) |  | Percentage of operations that are UPDATE Must be &gt;= 0.0 and &lt;= 1.0 |
| growth_rate | [float](#float) |  | Increase factor of the dataset_size in 1 year. |
| replication_factor | [int32](#int32) |  | Desired number of replicas. Must be &gt;= 3 and &lt;= 5 |
| project_id | [string](#string) |  | Identifier of project to request a recommendation in |
| region_id | [string](#string) |  | Identifier of region to request a recommendation in |






<a name="arangodb.cloud.data.v1.ImportDataInstructions"></a>

### ImportDataInstructions
Instructions for importing data into a deployment


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| import_dump | [string](#string) | repeated | Lines of code to run arangorestore |






<a name="arangodb.cloud.data.v1.ListCPUSizesRequest"></a>

### ListCPUSizesRequest
Request arguments for ListCPUSizes


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| project_id | [string](#string) |  | Identifier of project that will own a deployment. |






<a name="arangodb.cloud.data.v1.ListDeploymentModelsRequest"></a>

### ListDeploymentModelsRequest
Request arguments for ListDeploymentModels


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| project_id | [string](#string) |  | Identifier of project that will own a deployment. |






<a name="arangodb.cloud.data.v1.ListVersionsRequest"></a>

### ListVersionsRequest
Request arguments for ListVersions.


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| options | [arangodb.cloud.common.v1.ListOptions](#arangodb.cloud.common.v1.ListOptions) |  | Common list options |
| organization_id | [string](#string) |  | If set, the result includes all versions for that are available for the organization identified by this ID. If not set, only versions are returned that are available to all organizations. |
| current_version | [string](#string) |  | If set, only versions will be returned that are safe to upgrade to from this version. |






<a name="arangodb.cloud.data.v1.NodeSize"></a>

### NodeSize
NodeSize specifies the size constraints of different data nodes.


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [string](#string) |  | System identifier of the node size |
| name | [string](#string) |  | Human readable name of the node size |
| memory_size | [int32](#int32) |  | Amount of memory (in GB) that is available on this size of node. |
| min_disk_size | [int32](#int32) |  | Minimum amount of disk (in GB) that is available on this size of node. |
| max_disk_size | [int32](#int32) |  | Maximum amount of disk (in GB) that is available on this size of node. |
| cpu_size | [string](#string) |  | CPU size that is available on this size of node (e.g. standard or high). |






<a name="arangodb.cloud.data.v1.NodeSizeList"></a>

### NodeSizeList
List of node sizes.


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| items | [NodeSize](#arangodb.cloud.data.v1.NodeSize) | repeated |  |






<a name="arangodb.cloud.data.v1.NodeSizesRequest"></a>

### NodeSizesRequest
Request arguments for ListNodeSizes


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| project_id | [string](#string) |  | Identifier of project that will own a deployment. |
| region_id | [string](#string) |  | Identifier of a region in which a deployment will be created. |
| deployment_id | [string](#string) |  | If set, project_id &amp; region_id will be taken from this deployment. This also causes the node_size used by this deployment to be included in the result, if it it would not match for new deployments. |






<a name="arangodb.cloud.data.v1.ServersSpecLimits"></a>

### ServersSpecLimits
Limits of allowed values for fields of Deployment.ServersSpec.


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| coordinators | [ServersSpecLimits.Limits](#arangodb.cloud.data.v1.ServersSpecLimits.Limits) |  | Limits for the number of coordinators of the deployment |
| coordinator_memory_size | [ServersSpecLimits.Limits](#arangodb.cloud.data.v1.ServersSpecLimits.Limits) |  | Possible values for the amount of memory (in GB) to allocate for coordinators. |
| dbservers | [ServersSpecLimits.Limits](#arangodb.cloud.data.v1.ServersSpecLimits.Limits) |  | Limits for the number of dbservers of the deployment |
| dbserver_memory_size | [ServersSpecLimits.Limits](#arangodb.cloud.data.v1.ServersSpecLimits.Limits) |  | Possible values for the amount of memory (in GB) to allocate for dbservers. |
| dbserver_disk_size | [ServersSpecLimits.Limits](#arangodb.cloud.data.v1.ServersSpecLimits.Limits) |  | Amount of disk space (in GB) to allocate for dbservers. |
| node_memory_size | [ServersSpecLimits.Limits](#arangodb.cloud.data.v1.ServersSpecLimits.Limits) |  | Possible values for the amount of memory (in GB) to allocate for pairs of coordinator, dbserver. |
| node_count | [ServersSpecLimits.Limits](#arangodb.cloud.data.v1.ServersSpecLimits.Limits) |  | Possible values for the number of nodes. Value must be min/max (not using allowed_values) |






<a name="arangodb.cloud.data.v1.ServersSpecLimits.Limits"></a>

### ServersSpecLimits.Limits



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| min | [int32](#int32) |  | Minimum value |
| max | [int32](#int32) |  | Maximum value |
| allowed_values | [int32](#int32) | repeated | Set of allowed values. If this field is non-empty, only one of these values is allowed. |






<a name="arangodb.cloud.data.v1.ServersSpecLimitsRequest"></a>

### ServersSpecLimitsRequest
Request arguments for ListServersSpecLimits


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| project_id | [string](#string) |  | Identifier of project that will own a deployment. |
| region_id | [string](#string) |  | Identifier of a region in which a deployment will be created. |
| deployment_id | [string](#string) |  | Optional identifier of a deployment for which compatible server specifications are request. |






<a name="arangodb.cloud.data.v1.Version"></a>

### Version
Version of an ArangoDB release


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| version | [string](#string) |  | Version in the format of major.minor.patch |






<a name="arangodb.cloud.data.v1.VersionList"></a>

### VersionList
List of Versions.


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| items | [Version](#arangodb.cloud.data.v1.Version) | repeated |  |





 

 

 


<a name="arangodb.cloud.data.v1.DataService"></a>

### DataService
DataService is the API used to configure data objects.

| Method Name | Request Type | Response Type | Description |
| ----------- | ------------ | ------------- | ------------|
| GetAPIVersion | [.arangodb.cloud.common.v1.Empty](#arangodb.cloud.common.v1.Empty) | [.arangodb.cloud.common.v1.Version](#arangodb.cloud.common.v1.Version) | Get the current API version of this service. Required permissions: - None |
| ListDeployments | [.arangodb.cloud.common.v1.ListOptions](#arangodb.cloud.common.v1.ListOptions) | [DeploymentList](#arangodb.cloud.data.v1.DeploymentList) | Fetch all deployments in the project identified by the given context ID. Required permissions: - data.deployment.list on the project identified by the given context ID |
| GetDeployment | [.arangodb.cloud.common.v1.IDOptions](#arangodb.cloud.common.v1.IDOptions) | [Deployment](#arangodb.cloud.data.v1.Deployment) | Fetch a deployment by its id. Required permissions: - data.deployment.get on the deployment identified by the given ID |
| CreateDeployment | [Deployment](#arangodb.cloud.data.v1.Deployment) | [Deployment](#arangodb.cloud.data.v1.Deployment) | Create a new deployment Required permissions: - data.deployment.create on the project that owns the deployment Note that deployment.status &amp; deployment.expiration are ignored in this request. |
| UpdateDeployment | [Deployment](#arangodb.cloud.data.v1.Deployment) | [Deployment](#arangodb.cloud.data.v1.Deployment) | Update a deployment Required permissions: - data.deployment.update on the deployment Note that deployment.status &amp; deployment.expiration are ignored in this request. |
| DeleteDeployment | [.arangodb.cloud.common.v1.IDOptions](#arangodb.cloud.common.v1.IDOptions) | [.arangodb.cloud.common.v1.Empty](#arangodb.cloud.common.v1.Empty) | Delete a deployment Note that deployments are initially only marked for deletion. Once all their resources are removed the deployment itself is removed. Required permissions: - data.deployment.delete on the deployment |
| GetDeploymentCredentials | [DeploymentCredentialsRequest](#arangodb.cloud.data.v1.DeploymentCredentialsRequest) | [DeploymentCredentials](#arangodb.cloud.data.v1.DeploymentCredentials) | Fetch credentials for accessing deployment by its id. Required permissions: - data.deployment.get on the deployment identified by the given ID - data.deploymentcredentials.get on the deployment identified by the given ID |
| ListVersions | [ListVersionsRequest](#arangodb.cloud.data.v1.ListVersionsRequest) | [VersionList](#arangodb.cloud.data.v1.VersionList) | Fetch all ArangoDB versions that are available for deployments. Required permissions: - None |
| GetDefaultVersion | [.arangodb.cloud.common.v1.Empty](#arangodb.cloud.common.v1.Empty) | [Version](#arangodb.cloud.data.v1.Version) | Fetch the default ArangoDB version for new deployment. Required permissions: - None |
| GetServersSpecLimits | [ServersSpecLimitsRequest](#arangodb.cloud.data.v1.ServersSpecLimitsRequest) | [ServersSpecLimits](#arangodb.cloud.data.v1.ServersSpecLimits) | Fetch the limits for server specifications for deployments owned by the given projected, created in the given region. Required permissions: - data.limits.get on the requested project - data.deployment.get on the specified deployment (if deployment_id is set) This method is deprecated. |
| ListNodeSizes | [NodeSizesRequest](#arangodb.cloud.data.v1.NodeSizesRequest) | [NodeSizeList](#arangodb.cloud.data.v1.NodeSizeList) | Fetch the node sizes available for deployments owned by the project with given ID, created in the given region with given ID. If project ID &#34;all&#34; is used, then all node sizes for the region with given ID are returned. Required permissions: - data.nodesize.list on the requested project (if project ID does not equal &#34;all&#34;) - None if project ID does equals &#34;all&#34; |
| ListDeploymentModels | [ListDeploymentModelsRequest](#arangodb.cloud.data.v1.ListDeploymentModelsRequest) | [DeploymentModelList](#arangodb.cloud.data.v1.DeploymentModelList) | Fetch the models available for deployments owned by the project with given ID. Required permissions: - data.deploymentmodel.list on the requested project |
| ListCPUSizes | [ListCPUSizesRequest](#arangodb.cloud.data.v1.ListCPUSizesRequest) | [CPUSizeList](#arangodb.cloud.data.v1.CPUSizeList) | Fetch the CPU sizes available for deployments owned by the project with given ID. Required permissions: - data.cpusize.list on the requested project |
| CalculateDeploymentSize | [CalculateDeploymentSizeRequest](#arangodb.cloud.data.v1.CalculateDeploymentSizeRequest) | [DeploymentSize](#arangodb.cloud.data.v1.DeploymentSize) | Calculate the total size of a deployment with given arguments. Required permissions: - none |
| RecommendDeploymentSize | [DeploymentSizeRequest](#arangodb.cloud.data.v1.DeploymentSizeRequest) | [DeploymentSizeRecommendation](#arangodb.cloud.data.v1.DeploymentSizeRecommendation) | Recommend a deployment size, for a oneshard or sharded deployments, using the given input values. Required permissions: - none |
| GetConnectDriverInstructions | [.arangodb.cloud.common.v1.IDOptions](#arangodb.cloud.common.v1.IDOptions) | [ConnectDriverInstructions](#arangodb.cloud.data.v1.ConnectDriverInstructions) | Fetch instructions for connecting drivers to the deployment identified by the given id. Required permissions: - data.deployment.get on the deployment identified by the given ID |
| GetImportDataInstructions | [.arangodb.cloud.common.v1.IDOptions](#arangodb.cloud.common.v1.IDOptions) | [ImportDataInstructions](#arangodb.cloud.data.v1.ImportDataInstructions) | Fetch instructions for importing data into the deployment identified by the given id. Required permissions: - data.deployment.get on the deployment identified by the given ID |
| CalculateDeploymentPrice | [DeploymentPriceRequest](#arangodb.cloud.data.v1.DeploymentPriceRequest) | [DeploymentPrice](#arangodb.cloud.data.v1.DeploymentPrice) | Calculate the price of a deployment of given settings. Required permissions: - data.deploymentprice.calculate |

 



<a name="currency/v1/currency.proto"></a>
<p align="right"><a href="#top">Top</a></p>

## currency/v1/currency.proto



<a name="arangodb.cloud.currency.v1.Currency"></a>

### Currency
Currency represents a specific monetary currency.


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [string](#string) |  | System identifier of the currency. E.g. &#34;eur&#34; or &#34;usd&#34; |
| name | [string](#string) |  | Human readable name of the currency E.g. &#34;US Dollar&#34; |
| sign | [string](#string) |  | Human readable sign for the currency. E.g. &#34;$&#34; |
| iso4217_code | [string](#string) |  | ISO 4217 currency code. E.g. &#34;USD&#34; |






<a name="arangodb.cloud.currency.v1.CurrencyList"></a>

### CurrencyList
List of currencies.


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| items | [Currency](#arangodb.cloud.currency.v1.Currency) | repeated |  |






<a name="arangodb.cloud.currency.v1.GetDefaultCurrencyRequest"></a>

### GetDefaultCurrencyRequest
Request arguments for GetDefaultCurrency.


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| organization_id | [string](#string) |  | Optional identifier for the organization to request the default currency for. |





 

 

 


<a name="arangodb.cloud.currency.v1.CurrencyService"></a>

### CurrencyService
CurrencyService is the API used to query for supported currencies.

| Method Name | Request Type | Response Type | Description |
| ----------- | ------------ | ------------- | ------------|
| GetAPIVersion | [.arangodb.cloud.common.v1.Empty](#arangodb.cloud.common.v1.Empty) | [.arangodb.cloud.common.v1.Version](#arangodb.cloud.common.v1.Version) | Get the current API version of this service. Required permissions: - None |
| ListCurrencies | [.arangodb.cloud.common.v1.ListOptions](#arangodb.cloud.common.v1.ListOptions) | [CurrencyList](#arangodb.cloud.currency.v1.CurrencyList) | Fetch all providers that are supported by the ArangoDB cloud. Required permissions: - None |
| GetCurrency | [.arangodb.cloud.common.v1.IDOptions](#arangodb.cloud.common.v1.IDOptions) | [Currency](#arangodb.cloud.currency.v1.Currency) | Fetch a currency by its id. Required permissions: - None |
| GetDefaultCurrency | [GetDefaultCurrencyRequest](#arangodb.cloud.currency.v1.GetDefaultCurrencyRequest) | [Currency](#arangodb.cloud.currency.v1.Currency) | Fetch the default currency for a given (optional) organization. Required permissions: - resourcemanager.organization.get On the organization identified by given id. - None In case no organization identifier was given. |

 



<a name="billing/v1/billing.proto"></a>
<p align="right"><a href="#top">Top</a></p>

## billing/v1/billing.proto



<a name="arangodb.cloud.billing.v1.Address"></a>

### Address
Address of organization


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| address | [string](#string) | repeated | Address lines |
| zipcode | [string](#string) |  | ZIP code (if any) |
| city | [string](#string) |  | City |
| state | [string](#string) |  | State For US, this must be an ISO 3166-2 2-letter state code See https://en.wikipedia.org/wiki/List_of_U.S._state_abbreviations |
| country_code | [string](#string) |  | Country code |






<a name="arangodb.cloud.billing.v1.BillingConfig"></a>

### BillingConfig
Billing configuration for an organization


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| address | [Address](#arangodb.cloud.billing.v1.Address) |  | Address of the organization |
| vat_number | [string](#string) |  | EU VAT number of the organization (if any) |
| email_addresses | [string](#string) | repeated | Email address(es) to send emails related to billing (mostly invoices) to. |
| us_tax_number | [string](#string) |  | US sales tax number of the organization (if any) |






<a name="arangodb.cloud.billing.v1.CreatePaymentMethodRequest"></a>

### CreatePaymentMethodRequest
Request arguments for CreatePaymentMethod


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| prepared_payment_method | [PreparedPaymentMethod](#arangodb.cloud.billing.v1.PreparedPaymentMethod) |  | The result of PreparePaymentMethod. |
| first_name | [string](#string) |  | First name of owner of payment method |
| last_name | [string](#string) |  | Last name of owner of payment method |






<a name="arangodb.cloud.billing.v1.Invoice"></a>

### Invoice
An Invoice message describes a transaction for usage of ArangoDB Oasis.


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [string](#string) |  | System identifier of the invoice. |
| url | [string](#string) |  | URL of this resource |
| organization_id | [string](#string) |  | Identifier of the organization that is responsible for the payment of this invoice. |
| organization_name | [string](#string) |  | Name of the organization that is responsible for the payment of this invoice. |
| entity_id | [string](#string) |  | Identifier of the legal entity that is the sender of this invoice. |
| entity_name | [string](#string) |  | Name of the legal entity that is the sender of this invoice. |
| invoice_number | [string](#string) |  | Invoice number (used by accounting) |
| created_at | [google.protobuf.Timestamp](#google.protobuf.Timestamp) |  | The creation date of the invoice |
| requires_manual_verification | [bool](#bool) |  | If set, this invoice must be manually verified before payment can be initiated. |
| last_updated_at | [google.protobuf.Timestamp](#google.protobuf.Timestamp) |  | The last update date of the invoice. This applies to &#39;specification&#39; only and doesn&#39;t apply to status or payments changes. |
| invoice_builder_version | [string](#string) |  | The version of the invoice-builder who created the invoice. |
| items | [Invoice.Item](#arangodb.cloud.billing.v1.Invoice.Item) | repeated | All items of the invoice |
| currency_id | [string](#string) |  | Currency for all amounts |
| total_amount_excl_taxes | [float](#float) |  | Sum all amount for all items (excluding VAT and sales tax) |
| total_vat | [float](#float) |  | VAT amount for all items (applicable for Entity GmbH) |
| vat_reverse_charge | [bool](#bool) |  | If set, the VAT reverse charge rule is applied for this invoice. |
| vat_percentage_used | [float](#float) |  | The VAT percentage used |
| total_sales_tax | [float](#float) |  | Sales tax amount for all items (applicable for Entity Inc.) |
| sales_tax_percentage_used | [float](#float) |  | The sales tax percentage used |
| total_amount_incl_taxes | [float](#float) |  | Sum of total_amount_excl_taxes &#43; total_vat &#43; total_sales_tax. This is the amount that the customer will be charged for. |
| status | [Invoice.Status](#arangodb.cloud.billing.v1.Invoice.Status) |  |  |
| payments | [Invoice.Payment](#arangodb.cloud.billing.v1.Invoice.Payment) | repeated | All payment attempts for this invoice, ordered by created_at. |






<a name="arangodb.cloud.billing.v1.Invoice.Item"></a>

### Invoice.Item
A single item of the invoice


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| usageitem_ids | [string](#string) | repeated | Identifiers of the UsageItems that this item covers. |
| amount | [float](#float) |  | Amount of money (ex VAT) for this item |
| description | [string](#string) |  | Human readable description of this item |






<a name="arangodb.cloud.billing.v1.Invoice.Payment"></a>

### Invoice.Payment
Payment (attempt) of the invoice


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| created_at | [google.protobuf.Timestamp](#google.protobuf.Timestamp) |  | The timestamp of the start of the payment attempt. |
| payment_provider_id | [string](#string) |  | Identifier of the payment provider that is used for this payment. |
| payment_id | [string](#string) |  | Identifier of this payment (created by payment provider) |
| payment_method_id | [string](#string) |  | Identifier of the payment method that is used for this payment. |
| is_pending | [bool](#bool) |  | If set, this payment is still being processed. |
| is_completed | [bool](#bool) |  | If set, this payment has been payed for succesfully. |
| is_rejected | [bool](#bool) |  | If set, this payment has been rejected. |
| completed_at | [google.protobuf.Timestamp](#google.protobuf.Timestamp) |  | The timestamp of succesfull completion of the payment. |
| rejected_at | [google.protobuf.Timestamp](#google.protobuf.Timestamp) |  | The timestamp of rejected completion of the payment. |
| rejection_reason | [string](#string) |  | Human readable reason for the rejection. |






<a name="arangodb.cloud.billing.v1.Invoice.Status"></a>

### Invoice.Status
Status of the invoice


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| is_pending | [bool](#bool) |  | If set, this invoice is still being processed. |
| is_completed | [bool](#bool) |  | If set, a successful payment has been made for this invoice. |
| is_rejected | [bool](#bool) |  | If set, all payment attempts for this invoice have been rejected. |
| is_verified | [bool](#bool) |  | If set, this invoice has been verified manually. |
| needs_rebuild | [bool](#bool) |  | If set, this payment needs to be rebuild (by the invoice-builder service). If set, is_completed &amp; is_rejected must be false. |
| completed_at | [google.protobuf.Timestamp](#google.protobuf.Timestamp) |  | The timestamp of succesfull completion of the payment. This field equals the completed_at field of the last payment if that payment succeeded, nil otherwise. |
| rejected_at | [google.protobuf.Timestamp](#google.protobuf.Timestamp) |  | The timestamp of rejected completion of the payment. This field equals the rejected_at field of the last payment if that payment failed, nil otherwise. |






<a name="arangodb.cloud.billing.v1.InvoiceList"></a>

### InvoiceList
List of Invoices.


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| items | [Invoice](#arangodb.cloud.billing.v1.Invoice) | repeated |  |






<a name="arangodb.cloud.billing.v1.ListInvoicesRequest"></a>

### ListInvoicesRequest
Request arguments for ListInvoices


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| organization_id | [string](#string) |  | Request invoices for the organization with this id. This is a required field. |
| from | [google.protobuf.Timestamp](#google.protobuf.Timestamp) |  | Request invoices that are created at or after this timestamp. This is an optional field. |
| to | [google.protobuf.Timestamp](#google.protobuf.Timestamp) |  | Request invoices that are created before this timestamp. This is an optional field. |
| options | [arangodb.cloud.common.v1.ListOptions](#arangodb.cloud.common.v1.ListOptions) |  | Standard list options This is an optional field. |






<a name="arangodb.cloud.billing.v1.ListPaymentMethodsRequest"></a>

### ListPaymentMethodsRequest
Request arguments for ListPaymentMethods


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| organization_id | [string](#string) |  | Identifier of the organization for which payment methods are requested. |
| options | [arangodb.cloud.common.v1.ListOptions](#arangodb.cloud.common.v1.ListOptions) |  | Optional common list options. (Context ID is ignored) |






<a name="arangodb.cloud.billing.v1.ListPaymentProvidersRequest"></a>

### ListPaymentProvidersRequest
Request arguments for ListPaymentProviders


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| organization_id | [string](#string) |  | Identifier of the organization for which payment providers are requested. |
| options | [arangodb.cloud.common.v1.ListOptions](#arangodb.cloud.common.v1.ListOptions) |  | Optional common list options. (Context ID is ignored) |






<a name="arangodb.cloud.billing.v1.PDFDocument"></a>

### PDFDocument



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| content | [bytes](#bytes) |  | Content of the document |
| filename | [string](#string) |  | Filename of the document |






<a name="arangodb.cloud.billing.v1.PaymentMethod"></a>

### PaymentMethod
Payment methods are specific methods for paying at a specific payment provider
such as a specific credit card.


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [string](#string) |  | System identifier of this payment method. |
| name | [string](#string) |  | Name of the payment method |
| description | [string](#string) |  | Description of the payment method |
| payment_provider_id | [string](#string) |  | Identifier of the payment provider used for this payment method This is a read-only field. |
| organization_id | [string](#string) |  | Identifier of the organization that owns this payment method This is a read-only field. |
| created_at | [google.protobuf.Timestamp](#google.protobuf.Timestamp) |  | Creation timestamp of this payment method This is a read-only field. |
| deleted_at | [google.protobuf.Timestamp](#google.protobuf.Timestamp) |  | Deletion timestamp of this payment method This is a read-only field. |
| is_deleted | [bool](#bool) |  | Set if the payment method is deleted. This is a read-only field. |
| valid_until | [google.protobuf.Timestamp](#google.protobuf.Timestamp) |  | If set, this timestamp specifies when the payment method is no longer valid. If not set, there is no (known) end date for this payment method. |
| token | [string](#string) |  | Token for this payment method, provided by the payment provider. This is a read-only field. |
| type | [string](#string) |  | Type of payment method |
| is_default | [bool](#bool) |  | If set, this payment method is the default for its organization. This is a read-only field. |
| credit_card_info | [PaymentMethod.CreditCardInfo](#arangodb.cloud.billing.v1.PaymentMethod.CreditCardInfo) |  |  |






<a name="arangodb.cloud.billing.v1.PaymentMethod.CreditCardInfo"></a>

### PaymentMethod.CreditCardInfo
Information of the creditcard.
Only set when type == &#34;creditcard&#34;


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| last_digits | [string](#string) |  | Last 4 digits of the CC number. |
| card_type | [string](#string) |  | Type of creditcard |






<a name="arangodb.cloud.billing.v1.PaymentMethodList"></a>

### PaymentMethodList
List of Payment methods


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| items | [PaymentMethod](#arangodb.cloud.billing.v1.PaymentMethod) | repeated |  |






<a name="arangodb.cloud.billing.v1.PaymentProvider"></a>

### PaymentProvider
Payment providers are services that handle payments.


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [string](#string) |  | System identifier of this payment provider. |
| name | [string](#string) |  | Name of the payment provider |
| description | [string](#string) |  | Description of the payment provider |
| type | [string](#string) |  | Type of payment method supported by this provider |






<a name="arangodb.cloud.billing.v1.PaymentProviderList"></a>

### PaymentProviderList
List of Payment providers


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| items | [PaymentProvider](#arangodb.cloud.billing.v1.PaymentProvider) | repeated |  |






<a name="arangodb.cloud.billing.v1.PreparePaymentMethodRequest"></a>

### PreparePaymentMethodRequest
Request arguments for PreparePaymentMethod.


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| provider_id | [string](#string) |  | ID of the provider to prepare |
| organization_id | [string](#string) |  | ID of the organization that will own the future payment method |






<a name="arangodb.cloud.billing.v1.PreparedPaymentMethod"></a>

### PreparedPaymentMethod
Response data for PreparePaymentMethod.


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| provider_id | [string](#string) |  | ID of the provider of the future payment method |
| organization_id | [string](#string) |  | ID of the organization that will own the future payment method |
| token | [string](#string) |  | Token (semantics depends on payment provider) |
| script_url | [string](#string) |  | URL of custom script to load to create the payment method |
| signature | [string](#string) |  | Signature used to verify the consistency of the data in this message. |






<a name="arangodb.cloud.billing.v1.SetBillingConfigRequest"></a>

### SetBillingConfigRequest
Request arguments for SetBillingConfig.


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| organization_id | [string](#string) |  | Identifier of the organization for which billing address is to be set. |
| config | [BillingConfig](#arangodb.cloud.billing.v1.BillingConfig) |  | Billing configuration to set. |






<a name="arangodb.cloud.billing.v1.SetDefaultPaymentMethodRequest"></a>

### SetDefaultPaymentMethodRequest
Request argument for SetDefaultPaymentMethod


| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| organization_id | [string](#string) |  | Identifier of the organization for which the default payment method will be set. |
| payment_method_id | [string](#string) |  | Identifier of the new default payment method for the organization. |





 

 

 


<a name="arangodb.cloud.billing.v1.BillingService"></a>

### BillingService
BillingService is the API used to fetch billing information.

| Method Name | Request Type | Response Type | Description |
| ----------- | ------------ | ------------- | ------------|
| GetAPIVersion | [.arangodb.cloud.common.v1.Empty](#arangodb.cloud.common.v1.Empty) | [.arangodb.cloud.common.v1.Version](#arangodb.cloud.common.v1.Version) | Get the current API version of this service. Required permissions: - None |
| ListInvoices | [ListInvoicesRequest](#arangodb.cloud.billing.v1.ListInvoicesRequest) | [InvoiceList](#arangodb.cloud.billing.v1.InvoiceList) | Fetch all Invoice resources for the organization identified by the given organization ID that match the given criteria. Required permissions: - billing.invoice.list on the organization identified by the given organization ID |
| GetInvoice | [.arangodb.cloud.common.v1.IDOptions](#arangodb.cloud.common.v1.IDOptions) | [Invoice](#arangodb.cloud.billing.v1.Invoice) | Fetch a specific Invoice identified by the given ID. Required permissions: - billing.invoice.get on the organization that owns the invoice with given ID. |
| GetInvoicePDF | [.arangodb.cloud.common.v1.IDOptions](#arangodb.cloud.common.v1.IDOptions) | [PDFDocument](#arangodb.cloud.billing.v1.PDFDocument) | Fetch a specific Invoice identified by the given ID as PDF document. Required permissions: - billing.invoice.get on the organization that owns the invoice with given ID. |
| ListPaymentProviders | [ListPaymentProvidersRequest](#arangodb.cloud.billing.v1.ListPaymentProvidersRequest) | [PaymentProviderList](#arangodb.cloud.billing.v1.PaymentProviderList) | Fetch all payment providers that are usable for the organization identified by the given context ID. Required permissions: - billing.paymentprovider.list on the organization identified by the given context ID |
| GetPaymentProvider | [.arangodb.cloud.common.v1.IDOptions](#arangodb.cloud.common.v1.IDOptions) | [PaymentProvider](#arangodb.cloud.billing.v1.PaymentProvider) | Fetch a specific payment provider identified by the given ID. Required permissions: - None |
| ListPaymentMethods | [ListPaymentMethodsRequest](#arangodb.cloud.billing.v1.ListPaymentMethodsRequest) | [PaymentMethodList](#arangodb.cloud.billing.v1.PaymentMethodList) | Fetch all payment methods that are configured for the organization identified by the given context ID. Required permissions: - billing.paymentmethod.list on the organization identified by the given context ID |
| GetPaymentMethod | [.arangodb.cloud.common.v1.IDOptions](#arangodb.cloud.common.v1.IDOptions) | [PaymentMethod](#arangodb.cloud.billing.v1.PaymentMethod) | Fetch a specific payment method identified by the given ID. Required permissions: - billing.paymentmethod.get on the organization that owns the payment method which is identified by the given ID |
| PreparePaymentMethod | [PreparePaymentMethodRequest](#arangodb.cloud.billing.v1.PreparePaymentMethodRequest) | [PreparedPaymentMethod](#arangodb.cloud.billing.v1.PreparedPaymentMethod) | Prepare the payment provider for creating a new payment method. Required permissions: - billing.paymentmethod.create on the organization that owns future payment method. |
| CreatePaymentMethod | [CreatePaymentMethodRequest](#arangodb.cloud.billing.v1.CreatePaymentMethodRequest) | [PaymentMethod](#arangodb.cloud.billing.v1.PaymentMethod) | Create a new payment method. Required permissions: - billing.paymentmethod.create on the organization that owns the given payment method. |
| UpdatePaymentMethod | [PaymentMethod](#arangodb.cloud.billing.v1.PaymentMethod) | [PaymentMethod](#arangodb.cloud.billing.v1.PaymentMethod) | Update a specific payment method. Note that only name, description &amp; valid period are updated. Required permissions: - billing.paymentmethod.update on the organization that owns the given payment method. |
| DeletePaymentMethod | [.arangodb.cloud.common.v1.IDOptions](#arangodb.cloud.common.v1.IDOptions) | [.arangodb.cloud.common.v1.Empty](#arangodb.cloud.common.v1.Empty) | Delete a specific payment method identified by the given ID. Required permissions: - billing.paymentmethod.delete on the organization that owns the given payment method which is identified by the given ID. |
| GetDefaultPaymentMethod | [.arangodb.cloud.common.v1.IDOptions](#arangodb.cloud.common.v1.IDOptions) | [PaymentMethod](#arangodb.cloud.billing.v1.PaymentMethod) | Fetch the default PaymentMethod for an organization identified by the given ID. Required permissions: - billing.paymentmethod.get-default on the organization that is identified by the given ID |
| SetDefaultPaymentMethod | [SetDefaultPaymentMethodRequest](#arangodb.cloud.billing.v1.SetDefaultPaymentMethodRequest) | [.arangodb.cloud.common.v1.Empty](#arangodb.cloud.common.v1.Empty) | Update the default PaymentMethod for an organization identified by the given organization ID, to the payment method identified by the given payment method ID. Required permissions: - billing.paymentmethod.set-default on the organization identified by the given organization ID |
| GetBillingConfig | [.arangodb.cloud.common.v1.IDOptions](#arangodb.cloud.common.v1.IDOptions) | [BillingConfig](#arangodb.cloud.billing.v1.BillingConfig) | Fetch the billing configuration of an organization identified by the given ID. Required permissions: - billing.config.get on the organization that is identified by the given ID |
| SetBillingConfig | [SetBillingConfigRequest](#arangodb.cloud.billing.v1.SetBillingConfigRequest) | [.arangodb.cloud.common.v1.Empty](#arangodb.cloud.common.v1.Empty) | Update the billing configuration for an organization identified by the given organization ID. Required permissions: - billing.config.set on the organization identified by the given organization ID |

 



## Scalar Value Types

| .proto Type | Notes | C++ Type | Java Type | Python Type |
| ----------- | ----- | -------- | --------- | ----------- |
| <a name="double" /> double |  | double | double | float |
| <a name="float" /> float |  | float | float | float |
| <a name="int32" /> int32 | Uses variable-length encoding. Inefficient for encoding negative numbers – if your field is likely to have negative values, use sint32 instead. | int32 | int | int |
| <a name="int64" /> int64 | Uses variable-length encoding. Inefficient for encoding negative numbers – if your field is likely to have negative values, use sint64 instead. | int64 | long | int/long |
| <a name="uint32" /> uint32 | Uses variable-length encoding. | uint32 | int | int/long |
| <a name="uint64" /> uint64 | Uses variable-length encoding. | uint64 | long | int/long |
| <a name="sint32" /> sint32 | Uses variable-length encoding. Signed int value. These more efficiently encode negative numbers than regular int32s. | int32 | int | int |
| <a name="sint64" /> sint64 | Uses variable-length encoding. Signed int value. These more efficiently encode negative numbers than regular int64s. | int64 | long | int/long |
| <a name="fixed32" /> fixed32 | Always four bytes. More efficient than uint32 if values are often greater than 2^28. | uint32 | int | int |
| <a name="fixed64" /> fixed64 | Always eight bytes. More efficient than uint64 if values are often greater than 2^56. | uint64 | long | int/long |
| <a name="sfixed32" /> sfixed32 | Always four bytes. | int32 | int | int |
| <a name="sfixed64" /> sfixed64 | Always eight bytes. | int64 | long | int/long |
| <a name="bool" /> bool |  | bool | boolean | boolean |
| <a name="string" /> string | A string must always contain UTF-8 encoded or 7-bit ASCII text. | string | String | str/unicode |
| <a name="bytes" /> bytes | May contain any arbitrary sequence of bytes. | string | ByteString | str |

## Protocol Buffers Well-known Types

| Type | Reference |
| ---- | --------- |
| <a name="google.protobuf.Timestamp" />Timestamp | [google.protobuf.Timestamp](https://developers.google.com/protocol-buffers/docs/reference/google.protobuf#google.protobuf.Timestamp){:target="_blank"}
| <a name="google.protobuf.Duration" />Duration | [google.protobuf.Duration](https://developers.google.com/protocol-buffers/docs/reference/google.protobuf#duration){:target="_blank"}
