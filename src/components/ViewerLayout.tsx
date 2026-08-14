import { Outlet } from 'react-router-dom';

export default function ViewerLayout() {
  return (
    <div className="viewer">
      <Outlet />
    </div>
  );
}
