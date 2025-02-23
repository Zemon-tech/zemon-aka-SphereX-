export function validateUserData(data: any): boolean {
  const requiredFields = ['name', 'email'];
  const hasRequiredFields = requiredFields.every(field => !!data[field]);
  const hasId = !!data._id || !!data.id;
  
  console.log('Validating user data:', {
    data,
    hasRequiredFields,
    hasId
  });
  
  return hasRequiredFields && hasId;
} 