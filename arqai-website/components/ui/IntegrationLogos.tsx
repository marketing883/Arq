import React from "react";

interface LogoProps {
  size?: number;
  className?: string;
}

// AWS Logo
export function AWSLogo({ size = 48, className = "" }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M13.527 21.529c0 .538.057 1.015.162 1.375.114.36.262.748.458 1.164.076.133.105.266.105.39 0 .171-.105.342-.323.513l-1.069.713a.803.803 0 01-.437.133c-.171 0-.342-.085-.504-.247a5.203 5.203 0 01-.608-.788 13.16 13.16 0 01-.523-.988c-1.316 1.552-2.971 2.328-4.963 2.328-1.42 0-2.547-.405-3.375-1.214-.828-.81-1.247-1.89-1.247-3.243 0-1.437.505-2.604 1.524-3.49 1.019-.894 2.375-1.338 4.086-1.338.57 0 1.154.047 1.768.133.613.085 1.245.218 1.905.38v-1.237c0-1.285-.27-2.185-.799-2.708-.537-.523-1.449-.78-2.742-.78-.589 0-1.197.07-1.824.219a13.47 13.47 0 00-1.824.56 4.85 4.85 0 01-.589.218.997.997 0 01-.257.038c-.228 0-.342-.162-.342-.494v-.828c0-.257.038-.447.123-.56.085-.114.247-.228.494-.342a10.13 10.13 0 011.995-.713 8.68 8.68 0 012.461-.332c1.877 0 3.251.427 4.124 1.28.865.855 1.302 2.153 1.302 3.895v5.129h.019zm-6.857 2.566c.551 0 1.121-.1 1.72-.303.599-.2 1.131-.57 1.582-1.094.27-.332.47-.703.58-1.122.114-.418.171-.922.171-1.513v-.731a13.899 13.899 0 00-1.52-.295 12.604 12.604 0 00-1.553-.095c-1.116 0-1.933.218-2.461.665-.532.446-.79 1.073-.79 1.89 0 .77.195 1.342.594 1.73.39.39.96.58 1.677.58v.288zm13.564 1.834c-.295 0-.494-.047-.608-.152-.114-.095-.218-.304-.304-.58l-3.394-11.166a2.524 2.524 0 01-.123-.608c0-.247.123-.38.37-.38h1.662c.304 0 .513.047.618.152.114.095.2.304.285.58l2.432 9.58 2.261-9.58c.076-.285.162-.485.276-.58.114-.095.332-.152.627-.152h1.354c.304 0 .513.047.627.152.114.104.209.304.276.58l2.29 9.694 2.507-9.694c.086-.285.18-.485.285-.58.114-.095.323-.152.618-.152h1.577c.247 0 .38.123.38.38 0 .076-.019.152-.038.237a2.174 2.174 0 01-.095.38l-3.48 11.166c-.086.285-.19.485-.304.58-.114.095-.323.152-.608.152h-1.458c-.304 0-.513-.047-.627-.152-.114-.104-.2-.304-.276-.589l-2.252-9.332-2.242 9.323c-.076.285-.162.485-.276.589-.114.105-.332.152-.627.152h-1.458l.018.019zm21.69.437c-.87 0-1.739-.105-2.585-.304-.846-.2-1.506-.418-1.957-.665-.276-.152-.466-.323-.532-.485a1.227 1.227 0 01-.095-.466v-.866c0-.332.124-.494.361-.494a.892.892 0 01.285.047c.095.038.238.095.39.162a8.478 8.478 0 001.691.532 9.53 9.53 0 001.834.18c.97 0 1.72-.171 2.242-.513.523-.342.79-.837.79-1.47 0-.437-.133-.798-.409-1.093-.276-.295-.798-.56-1.553-.818l-2.233-.694c-1.12-.36-1.947-.894-2.46-1.608-.514-.703-.78-1.495-.78-2.347 0-.674.143-1.27.437-1.78.295-.513.684-.96 1.174-1.329a5.33 5.33 0 011.701-.845 6.882 6.882 0 012.014-.285c.352 0 .713.019 1.064.066.361.047.694.114 1.026.19.323.085.627.171.913.276.285.104.504.209.655.313.219.133.37.266.447.409.076.133.114.313.114.541v.799c0 .332-.123.503-.36.503a1.643 1.643 0 01-.6-.18 7.158 7.158 0 00-3.013-.617c-.876 0-1.568.133-2.062.409-.494.276-.746.693-.746 1.28 0 .437.152.808.456 1.102.304.295.866.589 1.672.856l2.185.693c1.112.36 1.91.865 2.385 1.513.475.646.704 1.385.704 2.204 0 .693-.143 1.323-.418 1.875-.285.551-.665 1.036-1.16 1.437-.494.409-1.083.722-1.767.94-.703.228-1.449.342-2.261.342z"
        fill="currentColor"
      />
      <path
        d="M42.296 35.432c-4.886 3.604-11.971 5.52-18.075 5.52-8.55 0-16.253-3.166-22.073-8.43-.456-.418-.047-.988.504-.665 6.287 3.657 14.064 5.863 22.092 5.863 5.416 0 11.372-1.122 16.853-3.452.827-.36 1.52.541.7 1.164z"
        fill="currentColor"
      />
      <path
        d="M44.296 33.114c-.627-.8-4.124-.38-5.701-.19-.475.057-.551-.361-.114-.665 2.79-1.962 7.37-1.39 7.902-.741.532.665-.143 5.225-2.756 7.406-.4.332-.78.152-.608-.285.589-1.476 1.91-4.734 1.277-5.525z"
        fill="currentColor"
      />
    </svg>
  );
}

// Azure Logo
export function AzureLogo({ size = 48, className = "" }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M17.895 6h11.584L17.276 40.895a1.777 1.777 0 01-1.68 1.189H6.12a1.777 1.777 0 01-1.68-2.366L15.215 7.189A1.777 1.777 0 0116.894 6h1.001z"
        fill="currentColor"
      />
      <path
        d="M35.495 28.558H18.262a.823.823 0 00-.561 1.426l11.09 10.372a1.79 1.79 0 001.22.479h10.336l-4.852-12.277z"
        fill="currentColor"
        opacity="0.8"
      />
      <path
        d="M17.895 6a1.757 1.757 0 00-1.671 1.21L5.473 39.749a1.758 1.758 0 001.657 2.335h9.698a1.95 1.95 0 001.541-1.083l2.263-4.124 8.085 7.556a1.769 1.769 0 001.165.402H40l-5.026-12.753-12.95.001L30.011 6H17.895z"
        fill="currentColor"
      />
    </svg>
  );
}

// Google Cloud Logo
export function GoogleCloudLogo({ size = 48, className = "" }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M30.66 12H17.34l-6.34 11 6.34 11h13.32l6.34-11-6.34-11zm-6.66 17a6 6 0 110-12 6 6 0 010 12z"
        fill="currentColor"
      />
      <path
        d="M33.13 18.27l4.94-2.85-1.08-1.87-4.94 2.85a9.04 9.04 0 00-2.74-1.58V9.69h-2.16v5.13a9.04 9.04 0 00-2.74 1.58l-4.94-2.85-1.08 1.87 4.94 2.85a8.96 8.96 0 000 5.46l-4.94 2.85 1.08 1.87 4.94-2.85c.77.68 1.7 1.21 2.74 1.58v5.13h2.16v-5.13a9.04 9.04 0 002.74-1.58l4.94 2.85 1.08-1.87-4.94-2.85a8.96 8.96 0 000-5.46z"
        fill="currentColor"
      />
    </svg>
  );
}

// OpenAI Logo
export function OpenAILogo({ size = 48, className = "" }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M41.47 19.75a10.15 10.15 0 00-.87-8.37 10.27 10.27 0 00-11.07-4.89A10.15 10.15 0 0021.9 3a10.25 10.25 0 00-9.8 7.14 10.16 10.16 0 00-6.78 4.92 10.27 10.27 0 001.27 12.05 10.16 10.16 0 00.88 8.36 10.27 10.27 0 0011.06 4.9A10.16 10.16 0 0026.1 45a10.27 10.27 0 009.8-7.14 10.16 10.16 0 006.78-4.93 10.25 10.25 0 00-1.21-13.18zM26.1 42.36a7.61 7.61 0 01-4.89-1.77l.24-.14 8.12-4.69a1.32 1.32 0 00.67-1.15V23.1l3.43 1.98a.12.12 0 01.07.1v9.5a7.64 7.64 0 01-7.64 7.68zm-16.42-7.03a7.6 7.6 0 01-.9-5.12l.23.14 8.13 4.69a1.33 1.33 0 001.33 0l9.93-5.73v3.97a.13.13 0 01-.05.1l-8.22 4.75a7.63 7.63 0 01-10.45-2.8zm-2.14-17.72a7.6 7.6 0 013.99-3.35v9.67a1.32 1.32 0 00.67 1.15l9.93 5.73-3.43 1.98a.13.13 0 01-.12 0l-8.22-4.75a7.64 7.64 0 01-2.82-10.43zM36 25.9l-9.93-5.73 3.43-1.98a.13.13 0 01.12 0l8.22 4.75a7.64 7.64 0 01-1.18 13.77v-9.66a1.33 1.33 0 00-.66-1.15zm3.41-5.2l-.24-.13-8.12-4.69a1.33 1.33 0 00-1.33 0l-9.93 5.74v-3.97a.12.12 0 01.05-.1l8.22-4.75a7.64 7.64 0 0111.35 7.9zm-21.48 7.07l-3.43-1.98a.12.12 0 01-.07-.1v-9.5A7.64 7.64 0 0127.2 9.95l-.24.14-8.12 4.69a1.32 1.32 0 00-.67 1.15l-.24 11.84zm1.87-4.01l4.42-2.55 4.43 2.55v5.1l-4.43 2.56-4.42-2.55v-5.11z"
        fill="currentColor"
      />
    </svg>
  );
}

// Anthropic Logo
export function AnthropicLogo({ size = 48, className = "" }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M28.92 10H33.6L44 38H39.04L28.92 10Z"
        fill="currentColor"
      />
      <path
        d="M19.08 10L4 38H9.04L12.24 30.4H25.28L22.16 22.56H15.04L19.08 13.04L26.4 30.4H31.36L19.08 10Z"
        fill="currentColor"
      />
    </svg>
  );
}

// Cohere Logo
export function CohereLogo({ size = 48, className = "" }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M13.5 32.25c0 1.667.675 3.175 1.762 4.262A6.023 6.023 0 0019.5 38.25h15c1.667 0 3.175-.675 4.238-1.738a6.023 6.023 0 001.762-4.262v-4.5H13.5v4.5z"
        fill="currentColor"
      />
      <path
        d="M13.5 21.75h27v-6c0-1.667-.675-3.175-1.762-4.238A6.023 6.023 0 0034.5 9.75h-15c-1.667 0-3.175.675-4.238 1.762A6.023 6.023 0 0013.5 15.75v6z"
        fill="currentColor"
      />
      <path
        d="M7.5 27.75a3 3 0 100-6 3 3 0 000 6z"
        fill="currentColor"
      />
    </svg>
  );
}

// Slack Logo
export function SlackLogo({ size = 48, className = "" }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M13.5 27a3 3 0 11-6 0 3 3 0 016 0zm8.25 0a3 3 0 01-3 3h-5.25v-6h5.25a3 3 0 013 3z"
        fill="currentColor"
      />
      <path
        d="M21 40.5a3 3 0 110-6 3 3 0 010 6zm0-8.25a3 3 0 01-3-3v-5.25h6v5.25a3 3 0 01-3 3z"
        fill="currentColor"
      />
      <path
        d="M34.5 21a3 3 0 116 0 3 3 0 01-6 0zm-8.25 0a3 3 0 013-3h5.25v6h-5.25a3 3 0 01-3-3z"
        fill="currentColor"
      />
      <path
        d="M27 7.5a3 3 0 110 6 3 3 0 010-6zm0 8.25a3 3 0 013 3v5.25h-6v-5.25a3 3 0 013-3z"
        fill="currentColor"
      />
    </svg>
  );
}

// Microsoft Teams Logo
export function TeamsLogo({ size = 48, className = "" }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M33.5 17.5a4 4 0 100-8 4 4 0 000 8z"
        fill="currentColor"
      />
      <path
        d="M41 20h-8a2 2 0 00-2 2v10a6 6 0 006 6h.5a5.5 5.5 0 005.5-5.5V22a2 2 0 00-2-2z"
        fill="currentColor"
      />
      <path
        d="M24.5 16a5.5 5.5 0 100-11 5.5 5.5 0 000 11z"
        fill="currentColor"
      />
      <path
        d="M30 18H13a2 2 0 00-2 2v14a8 8 0 008 8h3a8 8 0 008-8V20a2 2 0 00-2-2z"
        fill="currentColor"
      />
      <path
        d="M4 22v12a2 2 0 002 2h12a2 2 0 002-2V22a2 2 0 00-2-2H6a2 2 0 00-2 2z"
        fill="currentColor"
        opacity="0.9"
      />
      <path
        d="M15 24H9v2h2v6h2v-6h2v-2z"
        fill="white"
      />
    </svg>
  );
}

// Salesforce Logo
export function SalesforceLogo({ size = 48, className = "" }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M19.97 14.17a7.38 7.38 0 015.68-2.67 7.34 7.34 0 016.68 4.33 8.33 8.33 0 012.68-.44c4.6 0 8.33 3.74 8.33 8.34s-3.73 8.33-8.33 8.33a8.35 8.35 0 01-3.14-.62 6.47 6.47 0 01-5.7 3.45 6.45 6.45 0 01-3.37-.95 7.87 7.87 0 01-6.8 3.95c-4.05 0-7.41-3.05-7.86-6.98a6.78 6.78 0 01-3.47-5.93 6.78 6.78 0 016.77-6.78c.38 0 .76.03 1.13.1a7.39 7.39 0 017.4-4.13z"
        fill="currentColor"
      />
    </svg>
  );
}

// ServiceNow Logo
export function ServiceNowLogo({ size = 48, className = "" }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M24 6C14.059 6 6 14.059 6 24s8.059 18 18 18 18-8.059 18-18S33.941 6 24 6zm0 28.8c-5.965 0-10.8-4.835-10.8-10.8S18.035 13.2 24 13.2 34.8 18.035 34.8 24 29.965 34.8 24 34.8z"
        fill="currentColor"
      />
      <circle cx="24" cy="24" r="5" fill="currentColor" />
    </svg>
  );
}

// Snowflake Logo
export function SnowflakeLogo({ size = 48, className = "" }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M24 4v6.5M24 37.5V44M24 15.5L24 32.5"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M6.68 14l5.63 3.25M35.69 30.75L41.32 34M13.31 17.25L34.69 30.75"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M6.68 34l5.63-3.25M35.69 17.25L41.32 14M13.31 30.75L34.69 17.25"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle cx="24" cy="4" r="2" fill="currentColor" />
      <circle cx="24" cy="44" r="2" fill="currentColor" />
      <circle cx="6.68" cy="14" r="2" fill="currentColor" />
      <circle cx="41.32" cy="14" r="2" fill="currentColor" />
      <circle cx="6.68" cy="34" r="2" fill="currentColor" />
      <circle cx="41.32" cy="34" r="2" fill="currentColor" />
    </svg>
  );
}

// Databricks Logo
export function DatabricksLogo({ size = 48, className = "" }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M24 4L6 14v8l18 10 18-10v-8L24 4z"
        fill="currentColor"
      />
      <path
        d="M6 22v8l18 10 18-10v-8l-18 10L6 22z"
        fill="currentColor"
        opacity="0.7"
      />
      <path
        d="M6 30v8l18 10 18-10v-8l-18 10L6 30z"
        fill="currentColor"
        opacity="0.5"
      />
    </svg>
  );
}

// Integration Logo Map
export const IntegrationLogos: Record<
  string,
  React.FC<LogoProps>
> = {
  AWS: AWSLogo,
  Azure: AzureLogo,
  "Google Cloud": GoogleCloudLogo,
  OpenAI: OpenAILogo,
  Anthropic: AnthropicLogo,
  Cohere: CohereLogo,
  Slack: SlackLogo,
  "Microsoft Teams": TeamsLogo,
  Salesforce: SalesforceLogo,
  ServiceNow: ServiceNowLogo,
  Snowflake: SnowflakeLogo,
  Databricks: DatabricksLogo,
};

export function getIntegrationLogo(name: string): React.FC<LogoProps> | null {
  return IntegrationLogos[name] || null;
}
