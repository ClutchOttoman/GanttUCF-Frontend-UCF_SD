export function buildPath(route) {
  const domain = window.location.host;
  if (process.env.NODE_ENV === 'production') {
    return 'https://'+domain+'/' + route;
  } else {
    return 'http://localhost:5000/' + route;
  }
}
