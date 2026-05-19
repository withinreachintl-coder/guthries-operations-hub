// Parity config ported 1:1 from the n8n "Guthrie's Operations Hub" workflow.
// Folder IDs, recipients, subjects, sheet tabs, and row builders mirror the
// exact n8n node expressions so output is identical.

export const FOLDER_IDS: Record<string, string> = {
  Collierville: "1hRJZglUkKhR0uPnmJBK7cjSnd0mWhS-3",
  Dexter: "1Zn2m-u8qXtsYLAsvRyUkhk6lEfm98iHM",
  Whitehaven: "1bWdAF4wgQdcOOk-tz0H-sSKzkcIAqTMf",
  "Olive Branch": "1LSCscVhn1AzwloKralf5ucyBIHu7Kb2q",
  Oxford: "1PHhGVuSuxzHGj9QUEBi-h7vmBR6WRdSM",
};
export const DEFAULT_FOLDER = FOLDER_IDS.Collierville;

export const SHEET_ID = "1sDOlld_vsXQOamXWmV277jF-6Jl_XQGVU9d4gkcOov4";

export const EMAIL_RECIPIENTS =
  "wstine@burroughsrestaurantgroup.com,burroughsrestaurantgroup@gmail.com,mark@burroughsrestaurantgroup.com,brittany@burroughsrestaurantgroup.com,keon@burroughsrestaurantgroup.com";
export const EMAIL_FROM = "withinreachintl@gmail.com";

export type FormType =
  | "restaurant_inspection"
  | "lp_audit"
  | "rm_request"
  | "rm_close";

export interface FormConfig {
  tab: string;
  // builds the {header: value} map for the Sheets row (n8n defineBelow parity)
  row: (b: Body, photoUrl: string | null) => Record<string, string>;
  email?: { subject: (b: Body) => string };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Body = any;

const now = () => new Date().toISOString();
const str = (v: unknown) => (v === undefined || v === null ? "" : String(v));

// Inspection section column -> section.title (from n8n expressions)
const INSPECT_SECTIONS: Record<string, string> = {
  Exterior: "Exterior",
  "Dining Hall": "Dining Hall / Restrooms",
  "Cashier Alley": "Cashier Alley",
  Kitchen: "Kitchen",
  "Dry Storage": "Dry Storage / WIC / WIF",
  Prep: "Prep",
  Cooking: "Cooking",
  Chemicals: "Chemicals / Dish Area",
  Service: "Service",
  Employee: "Employee",
  "Food Quality": "Food Quality",
  Misc: "Misc",
};

// LP column -> item.text (from n8n expressions)
const LP_ITEMS: Record<string, string> = {
  "Office Neat/Clean": "Office neat and clean",
  "Verify Safe": "Verify safe",
  "Verify Deposits": "Verify deposit totals if applicable",
  "DSP Correction": "DSP correction entered weekly",
  "Ezcater Orders": "Ezcater orders entered on daily sheet",
  "Shift Log": "Using shift log",
  "Invoices Filed": "Invoices filed correctly",
  "Tamper Resistant Bags": "Using tamper resistant bags for deposit in sequence",
  "Time Edits": "Time edits daily",
  "Office/Safe Locked": "Office/safe locked",
  "Minor Shifts Review": "Review last three minor shifts for breaks",
  "Guest Complaint Log": "Guest complaint log up to date on PC",
  "Minor Files Review": "Review minor files in TN locations only",
};

export const FORMS: Record<FormType, FormConfig> = {
  restaurant_inspection: {
    tab: "Inspections",
    email: {
      subject: (b) =>
        `Restaurant Inspection — ${str(b.location)} — ${str(b.percentage)}%`,
    },
    row: (b) => {
      const sections: Body[] = Array.isArray(b.sections) ? b.sections : [];
      const r: Record<string, string> = {
        Timestamp: now(),
        Date: str(b.date),
        Location: str(b.location),
        "Inspector Name": str(b.inspectorName),
        "Store Manager": str(b.storeManager),
        "Person in Charge": str(b.personInCharge),
        "Start Time": str(b.startTime),
        "End Time": str(b.endTime),
        "Health Inspection": str(b.currentHealthInspection),
        "Previous Score": str(b.previousInspectionScore),
        "Total Earned": str(b.totalEarned),
        "Total Possible": str(b.totalPossible),
        Percentage: str(b.percentage),
      };
      for (const [col, title] of Object.entries(INSPECT_SECTIONS)) {
        const s = sections.find((x) => x.title === title);
        r[col] = s ? `${s.earned} / ${s.possible}` : "";
      }
      return r;
    },
  },

  lp_audit: {
    tab: "Loss Prevention Audits",
    email: {
      subject: (b) =>
        `Loss Prevention Audit — ${str(b.location)} — ${str(b.percentage)}%`,
    },
    row: (b) => {
      const items: Body[] = Array.isArray(b.items) ? b.items : [];
      const r: Record<string, string> = {
        Timestamp: now(),
        Date: str(b.date),
        Location: str(b.location),
        "Auditor Name": str(b.auditorName),
        "Manager on Duty": str(b.managerOnDuty),
        "Start Time": str(b.startTime),
        "End Time": str(b.endTime),
        "Total Earned": str(b.totalEarned),
        "Total Possible": str(b.totalPossible),
        Percentage: str(b.percentage),
      };
      for (const [col, text] of Object.entries(LP_ITEMS)) {
        const it = items.find((x) => x.text === text);
        r[col] = it && it.answer ? String(it.answer).toUpperCase() : "";
      }
      return r;
    },
  },

  rm_request: {
    tab: "R&M Requests",
    row: (b, photoUrl) => {
      const r: Record<string, string> = {
        Timestamp: now(),
        Date: str(b.date),
        Location: str(b.location),
        "Submitted By": str(b.submittedBy),
        "Work Order #": str(b.woNumber),
        Priority: str(b.priority),
        "Issue Description": str(b.issue),
        "Has Photo": photoUrl ? "YES" : "NO",
      };
      if (photoUrl) r["Photo URL"] = photoUrl;
      return r;
    },
  },

  rm_close: {
    tab: "R&M Requests - Closed",
    row: (b, photoUrl) => {
      const r: Record<string, string> = {
        Timestamp: now(),
        "Date Closed": str(b.dateClosed),
        "Time Closed": str(b.timeClosed),
        "Work Order #": str(b.woNumber),
        Location: str(b.location),
        "Closed By": str(b.closedBy),
        "Resolution Notes": str(b.resolutionNotes),
        "Has Photo": photoUrl ? "YES" : "NO",
      };
      if (photoUrl) r["Photo URL"] = photoUrl;
      return r;
    },
  },
};

export function folderForLocation(location: string | undefined): string {
  return (location && FOLDER_IDS[location]) || DEFAULT_FOLDER;
}
