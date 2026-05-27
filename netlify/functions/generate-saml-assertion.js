const crypto = require("crypto");
const { v4: uuidv4 } = require("uuid");
const { SignedXml } = require("xml-crypto");
const { DOMParser, XMLSerializer } = require("@xmldom/xmldom");

// Hardcoded Certificates
const CERT = `-----BEGIN CERTIFICATE-----
MIIEETCCAvmgAwIBAgIUXk8N7iNDQ5JOUBlZ+100pwDuuFswDQYJKoZIhvcNAQEL
BQAwgZcxCzAJBgNVBAYTAlVTMQswCQYDVQQIDAJOQzERMA8GA1UEBwwIR2FzdG9u
aWExDzANBgNVBAoMBnJrdW1hcjELMAkGA1UECwwCSVQxJTAjBgNVBAMMHHJrdW1h
cmlhZ29pZS5va3RhcHJldmlldy5jb20xIzAhBgkqhkiG9w0BCQEWFG9rdGFmb3Jh
aUBhdGtvLmVtYWlsMB4XDTI2MDUyNzAzNTEyMloXDTI3MDUyNzAzNTEyMlowgZcx
CzAJBgNVBAYTAlVTMQswCQYDVQQIDAJOQzERMA8GA1UEBwwIR2FzdG9uaWExDzAN
BgNVBAoMBnJrdW1hcjELMAkGA1UECwwCSVQxJTAjBgNVBAMMHHJrdW1hcmlhZ29p
ZS5va3RhcHJldmlldy5jb20xIzAhBgkqhkiG9w0BCQEWFG9rdGFmb3JhaUBhdGtv
LmVtYWlsMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAwS7So79+6yR5
KLvAauW3uUukkQEj0/klUjCK2voXZ+7tn0cMx3JAFTMvFsb07s7BiKuCZzuh6uI1
dfeqd40NspWlSKyqUsna5xSMNJWIZBe/TVtWIhMkiUk7qJFbUGPuUpOF3jI9sqfG
t7HDvJgGFV9j++YyHBcBXmBHT+kjOtHatSGfk6LpfdFUvjmXe2fG/ZKfV7jnx3YL
zq0ULveAXL8kNVngrUtnFs4HmYJnyn2CIbVqORCB8yILV+oUE55hQ1LSOR0dDWXX
QskOYHTu4WhomMkqjfyzShgxSwrbH02vY9y/hJ/E2HxoYV+heGYPFdbO9hia2OFu
vrkoYMHAIQIDAQABo1MwUTAdBgNVHQ4EFgQUmltFwamwLbXraKFnJ2luDaEaH18w
HwYDVR0jBBgwFoAUmltFwamwLbXraKFnJ2luDaEaH18wDwYDVR0TAQH/BAUwAwEB
/zANBgkqhkiG9w0BAQsFAAOCAQEAM1cQsZqLoOH1Y8toSlQQdSBhiN66ckd/YcPK
mu2ibh7puBY/4od2G2UF8211S0HL8cz6Y0mAdRuIBv8J3wj8OMRaruUt2VE7nmcR
s1kTpZ8mkH0hgwqYfPRJdhXuc5U18JMqzfg/MhVCoHaohmgRKavQJYD/eZ/BdrWU
c1XA6Fx14h3qVIg6q4pBUCXZB8hdMdZdegOQUU1rJFa6dJyJncejaEE/Uqtr2cA8
oZ0uB7yGIVGAGLAdj0WKxDF3h/um2KLeywkiXwcXjrdHYZM+oNAYoYt8vRvfeyLg
IBy4CTk1MGbvq0UVUNxexTdtEMWMrsNMhl3J/9wvROvvLsOhJw==
-----END CERTIFICATE-----`;

const KEY = `-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDBLtKjv37rJHko
u8Bq5be5S6SRASPT+SVSMIra+hdn7u2fRwzHckAVMy8WxvTuzsGIq4JnO6Hq4jV1
96p3jQ2ylaVIrKpSydrnFIw0lYhkF79NW1YiEySJSTuokVtQY+5Sk4XeMj2yp8a3
scO8mAYVX2P75jIcFwFeYEdP6SM60dq1IZ+Toul90VS+OZd7Z8b9kp9XuOfHdgvO
rRQu94BcvyQ1WeCtS2cWzgeZgmfKfYIhtWo5EIHzIgtX6hQTnmFDUtI5HR0NZddC
yQ5gdO7haGiYySqN/LNKGDFLCtsfTa9j3L+En8TYfGhhX6F4Zg8V1s72GJrY4W6+
uShgwcAhAgMBAAECggEAErRfZcZxWgAmkQiYyWDjqJfH39hd6TTK5cnYb/peEMyk
ClN9S8RmqwbRLOHnrkWrnHmKv0cZVt4/MeRgh4HLTTrLDZ3WQfzUaqJlLuQ5mANq
nOlWjicPVxGVqq0kS8TZOvqYsBpqOeWfyoJ2QsjvcdtSGX5A5NJfag1lajnXFOc4
cbqWZloDr3dN92Udiyw0V3KEYl2Htj5tPy/NaqB6BjYRWbnwo2a642NLu5J/klUC
ImS1VtAY+Rrih0nMGWgQfNwsWjfqiCnqkUs7bHAf8QSMZgbUoqXBZiSHUs2pY4W9
OS7pFZUDFSFqEsOHajdLAW58Vy330u7xvHK90xqvvwKBgQD4uaXAJUOgScWNiLmo
+C+gytX500X/VbfIBAfm+MyopIFb6DnRbFLPoHR+/QiSCUlBFrgwHo5oxFn/aJxa
lWF3BB5ymgTe1ULS6hZ+n2tqLhaYa0lz7rEQ5E2Kx3jO4OAbFm2+c3jMdhOUmWDg
wHjXTBuC53UopWSgC27j1vbACwKBgQDG1UwkI39/sCSnFmQ9Am7GF/6s8gFWeGTx
zxS+Fo//faimZpxSvBraEJNhpQojV5oFpBlq8EVj1I8OVAc/umIyXTGKeH7JR8B3
8UPE9dhN2QA4w+5EsWTY4r0OWEhP7tM3CARist2O+yujV3PiEpxMzEYMOh3Jq3+v
Zel+IoiAAwKBgQCUaxtoPBRNmpfi7Bp1pJuvJDppGFRll/3Rwe4BOqfNXlS+xiVy
PWRw9vttJ4qsshPfXjJMrH8oLzrQ+NiMCSWewnt0wUl0uudkOkFwD6smMhhTnXm4
T0+jl8hZrsv9Dx1LrKeSBQ+pWjA29QtlMhUpzAWCqKE1vvP7uLbUCFs3nwKBgHCI
oEOD49F8/AGlZq4xBkkPo5B2l9M86MUDExZS5sUPdbhYMvmQhRIOd5u4MPi3x/CR
Y+Fmg59w2ladsEydTJ58qGFauUdqWMCJyHVdP0MwIjP+kIhIbm9iROYtiR/UZ66p
1vGVklguSBB2mpvFNLkylCKvcdSGQAohf/lnyiHJAoGANznPtj5hrYRQrVQaTHkB
OLd4jgGieefRHj0ZIcBU4+4pLSWefmbubHx7TOuUoBcrVtUv9A0jLI2PcLj99/3O
wC6uKMf73WOSID1vr07r37PJtfJ8HNQKDP158vT+cGrABoEy8EwuqkMXeVut7pQw
jY6Qk3KgPSZZDDhfgF6rebI=
-----END PRIVATE KEY-----`;

// Configuration
const OKTA_DOMAIN = "rkumariagoie.oktapreview.com";
const MCP_GW_CLIENT_ID = "0oaz788v5lJscBg2P1d7";
const MCP_GW_CLIENT_SECRET =
  "G-Le9IoCCP-K7aO5wnIuz0Ac4QqyGDYVUxKYmdJrxTdaiunC8l3wfpZ1Q3m9srrv";
const MCP_GW_IDP_ISSUER_URI = "https://mcp-gateway.saml-assertion";
const MCP_GW_IDP_ACS_URL =
  "https://rkumariagoie.oktapreview.com/sso/saml2/0oaz78z4j353yPiLI1d7";
const MCP_GW_IDP_AUDIENCE_URI =
  "https://www.okta.com/saml2/service-provider/sppqqsjjfhyqmnkkxdse";

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
