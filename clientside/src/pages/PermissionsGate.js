import { cloneElement } from "react";
import { PERMISSIONS } from "./permission-maps";
import { useGetRole } from "./useGetRole";

const hasPermission = ({ permissions, scopes }) => {
  const scopesMap = {};
  scopes.forEach((scope) => {
    scopesMap[scope] = true;
  });

  return permissions.some((permission) => scopesMap[permission]);
};

export default function PermissionsGate({
  children,
  scopes = []
}) {
  const { role } = useGetRole();
  const permissions = PERMISSIONS[role];

  const permissionGranted = hasPermission({ permissions, scopes });

  if (!permissionGranted) return <></>

  return <>{children}</>;
}
