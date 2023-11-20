import config from '../config';

const APIService = {
  async GET({ endpoint, headers = {} }) {
    return await this.request(endpoint, 'GET', null, headers);
  },

  async POST({ endpoint, data, headers = {} }) {
    return await this.request(endpoint, 'POST', data, headers);
  },

  async PUT({ endpoint, data, headers = {} }) {
    return await this.request(endpoint, 'PUT', data, headers);
  },

  async DELETE({ endpoint, headers = {} }) {
    return await this.request(endpoint, 'DELETE', null, headers);
  },

  // using this internally
  async request(endpoint, method, data = null, headersParameter = {}) {
    const apiUrl = `${config.API_URL}${endpoint}`;

    const headers = new Headers({
      ...headersParameter,
      'Content-Type': 'application/json',
    });

    const requestOptions = {
      method: method,
      headers: headers,
      mode: 'cors',
      cache: 'no-cache',
    };

    if (data) {
      requestOptions.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(apiUrl, requestOptions);
      const jsonResponse = await response.json();
      if (!response.ok) {
        throw new Error(jsonResponse.message);
      }
      return jsonResponse;
    } catch (error) {
      throw error;
    }
  },
};

export default APIService;
