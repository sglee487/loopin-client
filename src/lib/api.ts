// RTK Query용 baseQuery
export const baseQuery = async (args: any) => {
  const { url, method = 'GET', body, params } = args;
  
  const config: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  let fullUrl = url;
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });
    fullUrl += `?${searchParams.toString()}`;
  }

  const response = await fetch(fullUrl, config);
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}; 