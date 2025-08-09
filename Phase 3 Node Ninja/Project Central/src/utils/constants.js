/*
 * =================================================================
 * ENUMERATION: User Roles
 * =================================================================
 * An "Enum" (short for Enumeration) is a programming pattern used to define a
 * collection of named constants. Instead of scattering raw strings like "admin"
 * or "member" throughout the codebase (which is prone to typos), we define
 * them in one centralized, authoritative place.
 *
 * This `UserRolesEnum` object serves as that single source of truth for all
 * possible user roles within our application.
 *
 * Benefits of this approach:
 * ✅ **Consistency:** Prevents typos (e.g., `prject_admin` vs `project_admin`).
 * ✅ **Maintainability:** If a role name needs to change, you only have to update it in this one file.
 * ✅ **Readability:** Using `UserRolesEnum.ADMIN` is more explicit and easier to understand than a random "admin" string.
 */
export const UserRolesEnum = {
    ADMIN: "admin",
    PROJECT_ADMIN: "project_admin",
    MEMBER: "member"
};

/*
 * =================================================================
 * ARRAY: Available User Roles
 * =================================================================
 * This line creates an array containing all the *values* from the `UserRolesEnum` object.
 *
 * `Object.values(UserRolesEnum)` takes the enum object and returns an array of its property values.
 * In this case, it will produce: `["admin", "project_admin", "member"]`.
 *
 * This is extremely useful for things like:
 * - Data validation in your Mongoose schema to ensure a user's role is one of these accepted values.
 * - Populating dropdown menus on a frontend UI for selecting a user role.
 */
export const AvailableUserRoles = Object.values(UserRolesEnum);


export const TaskStatusEnum = {
    TODO: "todo",
    IN_PROGRESS: "in_progress",
    DONE: "done",
};

export const AvailableTaskStatuses = Object.values(TaskStatusEnum)
