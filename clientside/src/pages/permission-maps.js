export const ROLES = {
    member: "MEMBER",
    staff: "STAFF",
    admin: "ADMIN"
  };
  
  export const SCOPES = {
    canCreate: "can-create",
    canEdit: "can-edit",
    canDelete: "can-delete",
    canView: "can-view"
  };
  
  export const PERMISSIONS = {
    [ROLES.member]: [SCOPES.canView],
    [ROLES.staff]: [SCOPES.canView, SCOPES.canEdit],
    [ROLES.admin]: [
      SCOPES.canView,
      SCOPES.canEdit,
      SCOPES.canCreate,
      SCOPES.canDelete
    ]
  };
  