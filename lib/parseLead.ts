export interface ParsedLead {
  full_name: string | null;
  address: string | null;
  project_type: string | null;
  description: string | null;
}

const TIME_REGEX = /^\d{1,2}:\d{2}\s*(am|pm)$/i;
const DATE_REGEX = /^\d{1,2}[\/-]\d{1,2}[\/-]\d{2,4}$/;
const ADDRESS_REGEX = /\d+.*,.*,/;

function toTitleCase(value: string): string {
  return value
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
}

export function parseLeadText(raw: string): ParsedLead {
  const lines = raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  let sawTime = false;
  let sawDate = false;
  const remaining: string[] = [];

  for (const line of lines) {
    if (!sawTime && TIME_REGEX.test(line)) {
      sawTime = true;
      continue;
    }
    if (!sawDate && DATE_REGEX.test(line)) {
      sawDate = true;
      continue;
    }
    remaining.push(line);
  }

  let address: string | null = null;
  const rest: string[] = [];

  for (const line of remaining) {
    if (!address && ADDRESS_REGEX.test(line)) {
      address = line;
      continue;
    }
    rest.push(line);
  }

  const fullName = rest.length > 0 ? toTitleCase(rest[0]) : null;
  const projectType = rest.length > 1 ? rest[rest.length - 1] : null;

  return { full_name: fullName, address, project_type: projectType, description: null };
}
