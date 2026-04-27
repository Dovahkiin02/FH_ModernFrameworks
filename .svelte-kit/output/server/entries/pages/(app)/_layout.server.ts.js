import { redirect } from "@sveltejs/kit";
function requireUser(user) {
  if (!user) {
    redirect(303, "/login");
  }
  return user;
}
const load = async ({ parent }) => {
  const { user } = await parent();
  requireUser(user);
  return { user };
};
export {
  load
};
