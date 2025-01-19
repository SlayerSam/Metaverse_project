import { useBox } from '@react-three/cannon';

export const StaticBase = ({ children }) => {
  const [ref] = useBox(() => ({
    position: [0, 0, 0],  // Adjust based on base position
    args: [10, 0.1, 10],  // Size matching the base dimensions
    type: 'Static',
  }));

  return <group ref={ref}>{children}</group>;
};



export const AvatarPhysics = ({ position, children }) => {
    const [ref] = useBox(() => ({
      mass: 1,
      position: [position.x, position.y, position.z],
      args: [0.5, 0, 0.5], // Avatar dimensions
      fixedRotation:true
    }));
  
    return <group ref={ref}>{children}</group>;
  };