const crypto = require("crypto");
const { v4: uuidv4 } = require("uuid");
const { SignedXml } = require("xml-crypto");
const { DOMParser, XMLSerializer } = require("@xmldom/xmldom");

// Hardcoded Certificates
const CERT = `-----BEGIN CERTIFICATE-----
MIID3zCCAsegAwIBAgIUWBPhz2DHmrVCiZYRVtiqF9oZr8AwDQYJKoZIhvcNAQEL
BQAwfzELMAkGA1UEBhMCVVMxCzAJBgNVBAgMAk5DMREwDwYDVQQHDAhHYXN0b25p
YTESMBAGA1UECgwJT2t0YWZvcmFpMRgwFgYDVQQLDA9va3RhcHJldmlldy5jb20x
IjAgBgNVBAMMGW9rdGFmb3JhaS5va3RhcHJldmlldy5jb20wHhcNMjYwNTI3MDIw
NzM4WhcNMjcwNTI3MDIwNzM4WjB/MQswCQYDVQQGEwJVUzELMAkGA1UECAwCTkMx
ETAPBgNVBAcMCEdhc3RvbmlhMRIwEAYDVQQKDAlPa3RhZm9yYWkxGDAWBgNVBAsM
D29rdGFwcmV2aWV3LmNvbTEiMCAGA1UEAwwZb2t0YWZvcmFpLm9rdGFwcmV2aWV3
LmNvbTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAMZjNSZLnsW4/dIo
rE/A5eLfYbRPh+ey0/SQQU970io5gOtr7mMOEUgF2vpUvANKCbWIKtulp53T3mfX
FEv9U/8DzzF/J3mj4LrEZlRAkB7tANdhgqdiDyRA9vSRTn/qTVGLd+RaTdQbqiuo
3WY/f7T1iKSnm1Mp1qHqDZ0Mojkj3sODfQECl2RkZ+rN8eIWoG21pscLaEy0oozw
eZfECmA8P1dBNuk3YAM1lRfHMHOEUAeIefHJt0an1rcB9NgcHMPpa2XxScGxkub5
A6CBNkQ6zyP74KNEkzZ5xDhZUmLnwX3y4MEuNkUL8+V3XME/e+p2bpZME29esGej
qJG5mskCAwEAAaNTMFEwHQYDVR0OBBYEFIu2f0o6KpXXSE5MrP2HvT9J1OeBMB8G
A1UdIwQYMBaAFIu2f0o6KpXXSE5MrP2HvT9J1OeBMA8GA1UdEwEB/wQFMAMBAf8w
DQYJKoZIhvcNAQELBQADggEBAErPDpv9OURaW6QIwb/+R7RLZMzwR6wZUSyEZlev
XqYiGygHGcS4yQr1XXFYzZgyQmFUKNcSVXZgCpG/0ktcLuE1oejfiabYRss/KXd9
eBKdTT8KCJUy+x2pGH2Ky/pDIMGl7R9R/Kma2yUfiAMg/VmRghVylRWz0lPWQVU9
NmOelRmNXFiGUMIDk9DoiXLYERi1dVJz/LQiXGw63XDt0bbK7F5ab+OKlyO3b+6N
3MocikdpV6CXlwlNV4Ng/SOkuFvhSGMqLfcOcRqOaDhJesJ0Pwc4OKtbT2nQQJcN
NSMs170XR2HQb913Adc+oaNonxl3sC1x/awbMmriW2GD6ho=
-----END CERTIFICATE-----`;

const KEY = `-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDGYzUmS57FuP3S
KKxPwOXi32G0T4fnstP0kEFPe9IqOYDra+5jDhFIBdr6VLwDSgm1iCrbpaed095n
1xRL/VP/A88xfyd5o+C6xGZUQJAe7QDXYYKnYg8kQPb0kU5/6k1Ri3fkWk3UG6or
qN1mP3+09Yikp5tTKdah6g2dDKI5I97Dg30BApdkZGfqzfHiFqBttabHC2hMtKKM
8HmXxApgPD9XQTbpN2ADNZUXxzBzhFAHiHnxybdGp9a3AfTYHBzD6Wtl8UnBsZLm
+QOggTZEOs8j++CjRJM2ecQ4WVJi58F98uDBLjZFC/Pld1zBP3vqdm6WTBNvXrBn
o6iRuZrJAgMBAAECggEAEne2QSYdddj6cdec8MCrdcLnKL6Vj21Pe075cXF8lzcq
p9+wfZKX6701zQNZzDGWdUpjePZzA8dvBvoX1toSeWUMotYsIc/uUdyKDRJEiEh2
QVZ/r966O5z7kDk9lj1ErNBfnQeGArZ/kRhjYcsL85e+vFso46U7qG9uDH5aVJi2
3VSUsvk0ZbgtuqICZaN5pyCJNYal9BRNazCV362l5VFAuSZLuvzDK/FzfPd7KZc7
vv9po0A4t9fuzx6eOzE7LKvSMmCapLbeKfRiCzRU9lQ00DKCQmN4+ukY58YkCXT7
Tl609aDnYS/2Q1tjwis+tNna/zIKMvQOUzw22QPToQKBgQD1mjzO1VhJVYu0geqo
x5fHzhzwqq9GsEfW9XE9VKByQSotKRsVDLgcvpu7GhPUPwPjFBj33UDFP6n/25d/
vJb3TCmz5KgkrPNJtHhkQ8mLYOxiAp5+AcxMcsajMdW4rOUKrvMxFxPeXPiXGx2K
Ov7yTGFiTtedrPVsmFzScU3OuQKBgQDOyUTqrXU6dFQaVw3wUOpHHZ8jcLhYAVqd
hI0MejacRD4j1FQQlQErrTpsFdngPFT7ERM6VtdE1jGf4nVCKbx/+TkWTKnFqAz1
mxdEL3oiOKO9WvcVZ2UlsVk7p+CQlzL9qvE8x34Y6uzalvufib7LzwHjX91j+nDZ
LAAt6YGkkQKBgEm12awlwZJ41y38k8XF6VqxFGRyhZpMi7MLBMpoXKMNxa+6F4Ow
xozx8+EqiWr44pzDSl8Riz/nxIiiigxvOEvOEvIHnSMsuPOU81D8Oz/WfftIV/Lv
bTZAeDdAXKlJUpBrQ1enWnIxKvaGz83NuPhVTiDoErQi1aGa9LjAAp8ZAoGAbM8h
kW8mkVSm8JlAP2UEcdlXZLmqdrx3pw0ZfyhL1hxeqlHOzk7pp8bmR/uTgtecS+Qn
Pvp1GcavpBbwZpk5lAlbDa3XY6dS8mXib0GgPaOaHUhhXYTjh1rzvl1O4CZ/cVVi
zP2YD5qGeVsbGk7L88iAkNlf0Hz2pn/ttDr7udECgYEA14lyHk4QnRdip1A0VMdv
Yg7Ai/R06ixmi15xi4RYKmHYuJmkFd0M4X/5bS+feTSPeMCh+4zH1LCl0vR24EMd
0kwhKTSOtGQW6MzgByVIqlypY7mSBxsfmJSvKu+fM/YxMvnLEr3o8O52msoaeVp/
7hxcd31yD+4VDg65K6IABus=
-----END PRIVATE KEY-----`;

// Configuration
const OKTA_DOMAIN = "oktaforai.oktapreview.com";
const MCP_GW_CLIENT_ID = "0oaz74zx9aku9lMAH1d7";
const MCP_GW_CLIENT_SECRET =
  "AeqjZBrKkIbIJEsZKI_SPq6V33fnc9HZp7brCZ-FmkJPKNsLFeNMO0wKBMu1Fcd1";
const MCP_GW_IDP_ISSUER_URI = "https://mcp-gateway.saml-assertion";
const MCP_GW_IDP_ACS_URL =
  "https://oktaforai.oktapreview.com/sso/saml2/0oaz76avfq1H6RE951d7";
const MCP_GW_IDP_AUDIENCE_URI =
  "https://www.okta.com/saml2/service-provider/spiycrxlqvxwbsytnkup/metadata";

function generateSamlId() {
  return `id${uuidv4().replace(/-/g, "")}`;
}

function getIsoTimestamp(deltaSeconds = 0) {
  const dt = new Date(Date.now() + deltaSeconds * 1000);
  return dt.toISOString().replace(/\.\d{3}Z$/, "Z");
}

function getCertificateContent(cert) {
  return cert
    .replace(/-----BEGIN CERTIFICATE-----/, "")
    .replace(/-----END CERTIFICATE-----/, "")
    .replace(/\s/g, "");
}

function generateSignedSamlAssertion(email) {
  const assertionId = generateSamlId();
  const responseId = generateSamlId();
  const sessionId = generateSamlId();
  const now = getIsoTimestamp();
  const notBefore = getIsoTimestamp(-10);
  const notOnOrAfter = getIsoTimestamp(24 * 60);

  // Build the Assertion XML
  const assertionXml = `<saml2:Assertion ID="${assertionId}" IssueInstant="${now}" Version="2.0" xmlns:saml2="urn:oasis:names:tc:SAML:2.0:assertion"><saml2:Issuer Format="urn:oasis:names:tc:SAML:2.0:nameid-format:entity">${MCP_GW_IDP_ISSUER_URI}</saml2:Issuer><saml2:Subject><saml2:NameID Format="urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified">${email}</saml2:NameID><saml2:SubjectConfirmation Method="urn:oasis:names:tc:SAML:2.0:cm:bearer"><saml2:SubjectConfirmationData NotOnOrAfter="${notOnOrAfter}" Recipient="${MCP_GW_IDP_ACS_URL}"/></saml2:SubjectConfirmation></saml2:Subject><saml2:Conditions NotBefore="${notBefore}" NotOnOrAfter="${notOnOrAfter}"><saml2:AudienceRestriction><saml2:Audience>${MCP_GW_IDP_AUDIENCE_URI}</saml2:Audience></saml2:AudienceRestriction></saml2:Conditions><saml2:AuthnStatement AuthnInstant="${now}" SessionIndex="${sessionId}"><saml2:AuthnContext><saml2:AuthnContextClassRef>urn:oasis:names:tc:SAML:2.0:ac:classes:PasswordProtectedTransport</saml2:AuthnContextClassRef></saml2:AuthnContext></saml2:AuthnStatement></saml2:Assertion>`;

  // Parse the assertion
  const doc = new DOMParser().parseFromString(assertionXml, "text/xml");

  // Create the signature
  const sig = new SignedXml();
  sig.signatureAlgorithm = "http://www.w3.org/2001/04/xmldsig-more#rsa-sha256";
  sig.canonicalizationAlgorithm = "http://www.w3.org/2001/10/xml-exc-c14n#";

  sig.addReference(
    `//*[@ID='${assertionId}']`,
    [
      "http://www.w3.org/2000/09/xmldsig#enveloped-signature",
      "http://www.w3.org/2001/10/xml-exc-c14n#",
    ],
    "http://www.w3.org/2001/04/xmlenc#sha256",
  );

  sig.signingKey = KEY;

  sig.keyInfoProvider = {
    getKeyInfo: function () {
      return `<X509Data><X509Certificate>${getCertificateContent(CERT)}</X509Certificate></X509Data>`;
    },
  };

  sig.computeSignature(assertionXml, {
    prefix: "ds",
    location: { reference: `//*[@ID='${assertionId}']`, action: "prepend" },
  });

  const signedAssertion = sig.getSignedXml();

  // Base64 encode
  return Buffer.from(signedAssertion, "utf-8").toString("base64");
}

async function exchangeSamlForToken(samlAssertion) {
  const url = `https://${OKTA_DOMAIN}/oauth2/v1/token`;

  const params = new URLSearchParams({
    grant_type: "urn:ietf:params:oauth:grant-type:saml2-bearer",
    scope:
      "openid email profile phone okta.myAccount.phone.manage offline_access",
    assertion: samlAssertion,
  });

  const auth = Buffer.from(
    `${MCP_GW_CLIENT_ID}:${MCP_GW_CLIENT_SECRET}`,
  ).toString("base64");

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${auth}`,
    },
    body: params.toString(),
  });

  const data = await response.json();

  if (response.ok) {
    return data;
  } else {
    return { error: data, status_code: response.status };
  }
}

exports.handler = async (event, context) => {
  // Handle CORS preflight
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
      },
      body: "",
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Method not allowed. Use POST." }),
    };
  }

  try {
    const body = JSON.parse(event.body || "{}");
    const email = body.email;

    if (!email) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Email is required" }),
      };
    }

    // Generate signed assertion
    const signedAssertion = generateSignedSamlAssertion(email);

    // Exchange for token
    const tokenResponse = await exchangeSamlForToken(signedAssertion);

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        saml_assertion: signedAssertion,
        token_response: tokenResponse,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: error.message }),
    };
  }
};
