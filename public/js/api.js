// api.js - Versão melhorada

const API_BASE = "http://localhost:3000/api";

async function apiFetch(path, options = {}) {
  const url = `${API_BASE}${path}`;
  const headers = options.headers || {};
  const token = localStorage.getItem("token");
  
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
    console.log('🔑 Token incluído na requisição:', token.substring(0, 20) + '...');
  }
  
  // don't set content-type for FormData
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = headers["Content-Type"] || "application/json";
  }
  
  const finalOptions = Object.assign({}, options, { headers });
  
  if (finalOptions.body && headers["Content-Type"] === "application/json" && !(finalOptions.body instanceof FormData)) {
    finalOptions.body = JSON.stringify(finalOptions.body);
  }

  console.log('📤 Fazendo requisição:', {
    url,
    method: finalOptions.method,
    headers: finalOptions.headers,
    body: finalOptions.body
  });

  try {
    const res = await fetch(url, finalOptions);
    const contentType = res.headers.get("Content-Type") || "";
    const text = await res.text();
    let data;
    
    try {
      data = contentType.includes("application/json") ? JSON.parse(text) : text;
    } catch (e) {
      data = text;
    }

    console.log('📥 Resposta recebida:', {
      status: res.status,
      statusText: res.statusText,
      data: data
    });

    if (!res.ok) {
      throw new Error(data.error || data.message || `Erro ${res.status}: ${res.statusText}`);
    }
    
    return data;
  } catch (error) {
    console.error('❌ Erro na requisição:', error);
    throw error;
  }
}

window.api = {
  get: (path) => apiFetch(path, { method: "GET" }),
  post: (path, body) => apiFetch(path, { method: "POST", body }),
  put: (path, body) => apiFetch(path, { method: "PUT", body }),
  del: (path) => apiFetch(path, { method: "DELETE" }),
};