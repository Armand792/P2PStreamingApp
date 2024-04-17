export const errorFormmatter = (error: any) => {
  return error?.response?.data?.message
    ? error?.response?.data?.message
    : error?.response?.data
    ? formatError(error)
    : error?.message;
};

function formatError(error: any) {
  return typeof error?.response?.data === 'string'
    ? error?.response?.data
    : error?.response?.data.errors.message;
}
export default errorFormmatter;
