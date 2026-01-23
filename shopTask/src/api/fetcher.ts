const authFetch = async (
    url: string,
    options: RequestInit = {}
  ) => {
    const token = localStorage.getItem('accessToken');
  
    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    });
  
    const data = await res.json();
  
    if (!res.ok) {
      throw data;
    }
  
    return data;
  };

  export default authFetch;
  