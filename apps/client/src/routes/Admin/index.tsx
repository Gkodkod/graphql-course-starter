
import Admin from "./Admin";
import { useAdminQuery } from "./queries.generated";

// Mock data removed

const AdminRoute = () => {
  const { data } = useAdminQuery();

  const jobs = data?.me?.ownedJobs ?? [];

  return <Admin jobs={jobs} />;
};

export default AdminRoute;
