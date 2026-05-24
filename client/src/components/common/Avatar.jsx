import { getInitials, getAvatarColor } from '../../utils/helpers';

const Avatar = ({ user, size = 'sm', showName = false, className = '' }) => {
  const sizes = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className={`${sizes[size]} rounded-full flex items-center justify-center font-bold text-white flex-shrink-0`}
        style={{ background: getAvatarColor(user?.name) }}
        title={user?.name}>
        {getInitials(user?.name)}
      </div>
      {showName && (
        <div>
          <p className="text-sm font-medium text-white">{user?.name}</p>
          {user?.email && <p className="text-xs text-gray-500">{user?.email}</p>}
        </div>
      )}
    </div>
  );
};

export const AvatarGroup = ({ users = [], max = 3, size = 'sm' }) => {
  const shown = users.slice(0, max);
  const rest = users.length - max;
  const sizeMap = { xs: 'w-6 h-6 text-[10px]', sm: 'w-7 h-7 text-xs', md: 'w-8 h-8 text-xs' };

  return (
    <div className="flex -space-x-2">
      {shown.map((user, i) => (
        <div key={user?._id || i}
          className={`${sizeMap[size]} rounded-full flex items-center justify-center font-bold text-white ring-2 ring-dark-700`}
          style={{ background: getAvatarColor(user?.name) }}
          title={user?.name}>
          {getInitials(user?.name)}
        </div>
      ))}
      {rest > 0 && (
        <div className={`${sizeMap[size]} rounded-full flex items-center justify-center text-xs font-bold text-gray-400 ring-2 ring-dark-700`}
          style={{ background: 'rgba(255,255,255,0.08)' }}>
          +{rest}
        </div>
      )}
    </div>
  );
};

export default Avatar;
