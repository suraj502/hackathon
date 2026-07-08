import { useState, type ReactNode } from "react";
import { z } from "zod";
import { CheckCircle2, Loader2, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { registerTeam } from "@/lib/hackathon-api";

const GENDER_OPTIONS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
  { value: "prefer_not_to_say", label: "Prefer not to say" },
] as const;

const memberKeys = [
  {
    number: 2,
    nameKey: "member2Name",
    emailKey: "member2Email",
    branchKey: "member2Branch",
    yearKey: "member2Year",
    genderKey: "member2Gender",
  },
  {
    number: 3,
    nameKey: "member3Name",
    emailKey: "member3Email",
    branchKey: "member3Branch",
    yearKey: "member3Year",
    genderKey: "member3Gender",
  },
  {
    number: 4,
    nameKey: "member4Name",
    emailKey: "member4Email",
    branchKey: "member4Branch",
    yearKey: "member4Year",
    genderKey: "member4Gender",
  },
] as const;

const schema = z.object({
  teamName: z.string().trim().min(2, "Team name is required").max(60, "Team name too long"),
  collegeName: z.string().trim().min(2, "College is required").max(120, "College name too long"),
  teamSize: z.enum(["1", "2", "3", "4"], { message: "Select a team size" }),
  track: z.enum(["ai", "web3", "climate", "open"], { message: "Pick a track" }),
  leaderName: z.string().trim().min(2, "Leader name is required").max(80, "Name too long"),
  leaderEmail: z.string().trim().email("Enter a valid email").max(255, "Email too long"),
  leaderPhone: z.string().trim().regex(/^\+?[0-9]{7,15}$/, "Enter a valid phone number"),
  leaderBranch: z.string().trim().min(2, "Leader branch is required").max(80, "Branch too long"),
  leaderYear: z.string().trim().min(1, "Leader year is required").max(20, "Year too long"),
  leaderGender: z.enum(["male", "female", "other", "prefer_not_to_say"], {
    message: "Select a gender",
  }),
  ideaPitch: z
    .string()
    .trim()
    .min(20, "Tell us at least 20 characters about your idea")
    .max(1000, "Keep it under 1000 characters"),
  member2Name: z.string().trim().max(80, "Name too long"),
  member2Email: z.string().trim().email("Enter a valid email").or(z.literal("")),
  member2Branch: z.string().trim().max(80, "Branch too long"),
  member2Year: z.string().trim().max(20, "Year too long"),
  member2Gender: z.enum(["male", "female", "other", "prefer_not_to_say", ""], {
    message: "Select a gender",
  }),
  member3Name: z.string().trim().max(80, "Name too long"),
  member3Email: z.string().trim().email("Enter a valid email").or(z.literal("")),
  member3Branch: z.string().trim().max(80, "Branch too long"),
  member3Year: z.string().trim().max(20, "Year too long"),
  member3Gender: z.enum(["male", "female", "other", "prefer_not_to_say", ""], {
    message: "Select a gender",
  }),
  member4Name: z.string().trim().max(80, "Name too long"),
  member4Email: z.string().trim().email("Enter a valid email").or(z.literal("")),
  member4Branch: z.string().trim().max(80, "Branch too long"),
  member4Year: z.string().trim().max(20, "Year too long"),
  member4Gender: z.enum(["male", "female", "other", "prefer_not_to_say", ""], {
    message: "Select a gender",
  }),
});

type FormValues = z.infer<typeof schema>;
type Errors = Partial<Record<keyof FormValues, string>>;

const initial: Record<keyof FormValues, string> = {
  teamName: "",
  collegeName: "",
  teamSize: "",
  track: "",
  leaderName: "",
  leaderEmail: "",
  leaderPhone: "",
  leaderBranch: "",
  leaderYear: "",
  leaderGender: "",
  ideaPitch: "",
  member2Name: "",
  member2Email: "",
  member2Branch: "",
  member2Year: "",
  member2Gender: "",
  member3Name: "",
  member3Email: "",
  member3Branch: "",
  member3Year: "",
  member3Gender: "",
  member4Name: "",
  member4Email: "",
  member4Branch: "",
  member4Year: "",
  member4Gender: "",
};

const STEPS = [
  { title: "Team Information", fields: ["teamName", "teamSize", "track", "collegeName"] as const },
  {
    title: "Leader Details",
    fields: ["leaderName", "leaderEmail", "leaderPhone", "leaderBranch", "leaderYear", "leaderGender"] as const,
  },
  { title: "Members & Idea", fields: ["ideaPitch"] as const },
  { title: "Review & Submit", fields: [] as const },
] as const;

export function Registration() {
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [step, setStep] = useState(0);
  const [submitArmed, setSubmitArmed] = useState(false);
  const [serverMessage, setServerMessage] = useState<string | null>(null);

  const memberCount = Math.max(0, Math.min(3, (Number(values.teamSize) || 0) - 1));

  const update = (key: keyof FormValues, val: string) => {
    if (key === "teamSize") {
      const nextCount = Math.max(0, Math.min(3, (Number(val) || 0) - 1));
      setValues((current) => {
        const next = { ...current, teamSize: val };
        for (const member of memberKeys.slice(nextCount)) {
          next[member.nameKey] = "";
          next[member.emailKey] = "";
          next[member.branchKey] = "";
          next[member.yearKey] = "";
          next[member.genderKey] = "";
        }
        return next;
      });

      setErrors((current) => {
        const next = { ...current };
        for (const member of memberKeys.slice(nextCount)) {
          next[member.nameKey] = undefined;
          next[member.emailKey] = undefined;
          next[member.branchKey] = undefined;
          next[member.yearKey] = undefined;
          next[member.genderKey] = undefined;
        }
        return next;
      });
      return;
    }

    setValues((current) => ({ ...current, [key]: val }));
    if (errors[key]) {
      setErrors((current) => ({ ...current, [key]: undefined }));
    }
  };

  const validateSelectedMembers = () => {
    const errorsToApply: Errors = {};
    const selected = memberKeys.slice(0, memberCount);

    for (const member of selected) {
      const nameValue = values[member.nameKey].trim();
      const emailValue = values[member.emailKey].trim();
      const branchValue = values[member.branchKey].trim();
      const yearValue = values[member.yearKey].trim();

      if (nameValue.length < 2) {
        errorsToApply[member.nameKey] = `Member ${member.number} name is required`;
      }

      if (!emailValue) {
        errorsToApply[member.emailKey] = `Member ${member.number} email is required`;
      }

      if (!branchValue) {
        errorsToApply[member.branchKey] = `Member ${member.number} branch is required`;
      }

      if (!yearValue) {
        errorsToApply[member.yearKey] = `Member ${member.number} year is required`;
      }

      if (!values[member.genderKey]) {
        errorsToApply[member.genderKey] = `Select gender for member ${member.number}`;
      }
    }

    const genders = [values.leaderGender, ...selected.map((member) => values[member.genderKey])];
    const hasFemaleMember = genders.some((gender) => gender === "female");

    if (!hasFemaleMember && (selected.length > 0 || values.leaderGender)) {
      const femaleField = selected[0]?.genderKey ?? "leaderGender";
      errorsToApply[femaleField] = "At least one female member is required in the team";
    }

    const emails = [
      values.leaderEmail.trim().toLowerCase(),
      ...selected.map((member) => values[member.emailKey].trim().toLowerCase()),
    ].filter(Boolean);

    const names = [
      values.leaderName.trim().toLowerCase(),
      ...selected.map((member) => values[member.nameKey].trim().toLowerCase()),
    ].filter(Boolean);

    if (new Set(emails).size !== emails.length) {
      errorsToApply.leaderEmail = errorsToApply.leaderEmail || "Duplicate emails are not allowed";
    }

    if (new Set(names).size !== names.length) {
      errorsToApply.leaderName = errorsToApply.leaderName || "Duplicate member names are not allowed";
    }

    setErrors((current) => {
      const next = { ...current };
      for (const member of memberKeys) {
        next[member.nameKey] = undefined;
        next[member.emailKey] = undefined;
        next[member.branchKey] = undefined;
        next[member.yearKey] = undefined;
        next[member.genderKey] = undefined;
      }
      next.leaderEmail = undefined;
      next.leaderName = undefined;
      return { ...next, ...errorsToApply };
    });

    return Object.keys(errorsToApply).length === 0;
  };

  const validateFields = (fields: ReadonlyArray<keyof FormValues>) => {
    const parsed = schema.safeParse(values);

    if (parsed.success) {
      setErrors((current) => {
        const next = { ...current };
        for (const field of fields) {
          next[field] = undefined;
        }
        return next;
      });
      return true;
    }

    const stepErrors: Errors = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0] as keyof FormValues;
      if (fields.includes(field) && !stepErrors[field]) {
        stepErrors[field] = issue.message;
      }
    }

    setErrors((current) => ({ ...current, ...stepErrors }));
    return Object.keys(stepErrors).length === 0;
  };

  const nextStep = () => {
    if (step === 2) {
      if (!validateSelectedMembers()) return;
      if (!validateFields(STEPS[step].fields)) return;
    } else {
      if (!validateFields(STEPS[step].fields)) return;
    }

    setStep((current) => Math.min(current + 1, STEPS.length - 1));
  };

  const prevStep = () => {
    setStep((current) => Math.max(current - 1, 0));
  };

  const buildPayload = () => ({
    teamName: values.teamName.trim(),
    collegeName: values.collegeName.trim(),
    track: values.track,
    teamSize: Number(values.teamSize),
    ideaPitch: values.ideaPitch.trim(),
    leader: {
      name: values.leaderName.trim(),
      email: values.leaderEmail.trim().toLowerCase(),
      phone: values.leaderPhone.trim(),
      branch: values.leaderBranch.trim(),
      year: values.leaderYear.trim(),
      gender: values.leaderGender,
    },
    members: memberKeys.slice(0, memberCount).map((member) => ({
      name: values[member.nameKey].trim(),
      email: values[member.emailKey].trim().toLowerCase(),
      branch: values[member.branchKey].trim(),
      year: values[member.yearKey].trim(),
      gender: values[member.genderKey],
    })),
  });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step !== STEPS.length - 1) return;
    if (!submitArmed) return;
    setSubmitArmed(false);
    setServerMessage(null);

    if (!validateSelectedMembers()) {
      setStep(2);
      return;
    }

    const parsed = schema.safeParse(values);
    if (!parsed.success) {
      const fieldErrors: Errors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof FormValues;
        if (!fieldErrors[key]) {
          fieldErrors[key] = issue.message;
        }
      }
      setErrors(fieldErrors);
      return;
    }

    setStatus("submitting");

    try {
      const response = await registerTeam(buildPayload());
      setStatus("success");
      setServerMessage(`Team ${response.team.teamName} registered successfully.`);
    } catch (requestError) {
      setStatus("error");
      setServerMessage(requestError instanceof Error ? requestError.message : "Registration failed");
    }
  };

  const reset = () => {
    setValues(initial);
    setErrors({});
    setStatus("idle");
    setStep(0);
    setSubmitArmed(false);
    setServerMessage(null);
  };

  const current = STEPS[step];

  return (
    <section id="register" className="relative border-t border-border/40 py-20 sm:py-24">
      <div className="absolute inset-0 -z-10 bg-grid opacity-30" />
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
            [ REGISTER_04 ]
          </span>
          <h2 className="mt-3 font-mono text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Lock in your orbit slot
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground sm:text-base">
            Submissions open until 27 July. Spin up your team, pick a track, drop your idea.
          </p>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card/40 p-4 shadow-glow backdrop-blur sm:p-10">
          {status === "success" ? (
            <div className="flex flex-col items-center py-10 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/15 ring-1 ring-primary/40">
                <CheckCircle2 className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mt-5 font-mono text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                You&apos;re in orbit, {values.teamName}!
              </h3>
              <p className="mt-2 max-w-md text-sm text-muted-foreground">
                <span className="font-mono text-primary">{serverMessage}</span>
              </p>
              <Button
                onClick={reset}
                variant="outline"
                className="mt-6 font-mono text-xs uppercase tracking-wider"
              >
                Register another team
              </Button>
            </div>
          ) : (
            <form onSubmit={onSubmit} noValidate className="space-y-5">
              <div className="rounded-lg border border-border/60 bg-background/30 px-4 py-3">
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
                  Step {step + 1} of {STEPS.length}
                </p>
                <p className="mt-1 font-mono text-[11px] text-muted-foreground">-----------------</p>
                <h3 className="mt-2 font-mono text-lg font-bold text-foreground">{current.title}</h3>
              </div>

              {serverMessage && status === "error" && (
                <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  {serverMessage}
                </div>
              )}

              {step === 0 && (
                <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
                  <Field label="Team name" error={errors.teamName} className="sm:col-span-1">
                    <Input
                      value={values.teamName}
                      onChange={(e) => update("teamName", e.target.value)}
                      placeholder="Orbital Foxes"
                      maxLength={60}
                      aria-invalid={!!errors.teamName}
                    />
                  </Field>

                  <Field label="Team size" error={errors.teamSize} className="sm:col-span-1">
                    <Select value={values.teamSize} onValueChange={(v) => update("teamSize", v)}>
                      <SelectTrigger aria-invalid={!!errors.teamSize}>
                        <SelectValue placeholder="Select size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Solo</SelectItem>
                        <SelectItem value="2">2 members</SelectItem>
                        <SelectItem value="3">3 members</SelectItem>
                        <SelectItem value="4">4 members</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>

                  <Field label="Track" error={errors.track} className="sm:col-span-2">
                    <Select value={values.track} onValueChange={(v) => update("track", v)}>
                      <SelectTrigger aria-invalid={!!errors.track}>
                        <SelectValue placeholder="Choose your track" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ai">AI &amp; Agents</SelectItem>
                        <SelectItem value="web3">Web3 &amp; Infra</SelectItem>
                        <SelectItem value="climate">Climate Tech</SelectItem>
                        <SelectItem value="open">Open Innovation</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>

                  <Field label="College" error={errors.collegeName} className="sm:col-span-2">
                    <Input
                      value={values.collegeName}
                      onChange={(e) => update("collegeName", e.target.value)}
                      placeholder="Your college or university"
                      maxLength={120}
                      aria-invalid={!!errors.collegeName}
                    />
                  </Field>
                </div>
              )}

              {step === 1 && (
                <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
                  <Field label="Leader name" error={errors.leaderName} className="sm:col-span-1">
                    <Input
                      value={values.leaderName}
                      onChange={(e) => update("leaderName", e.target.value)}
                      placeholder="Ada Lovelace"
                      maxLength={80}
                      aria-invalid={!!errors.leaderName}
                    />
                  </Field>

                  <Field label="Leader email" error={errors.leaderEmail} className="sm:col-span-1">
                    <Input
                      type="email"
                      value={values.leaderEmail}
                      onChange={(e) => update("leaderEmail", e.target.value)}
                      placeholder="you@domain.com"
                      maxLength={255}
                      aria-invalid={!!errors.leaderEmail}
                    />
                  </Field>

                  <Field label="Leader phone" error={errors.leaderPhone} className="sm:col-span-1">
                    <Input
                      value={values.leaderPhone}
                      onChange={(e) => update("leaderPhone", e.target.value)}
                      placeholder="+919876543210"
                      maxLength={16}
                      aria-invalid={!!errors.leaderPhone}
                    />
                  </Field>

                  <Field label="Leader branch" error={errors.leaderBranch} className="sm:col-span-1">
                    <Input
                      value={values.leaderBranch}
                      onChange={(e) => update("leaderBranch", e.target.value)}
                      placeholder="Computer Science"
                      maxLength={80}
                      aria-invalid={!!errors.leaderBranch}
                    />
                  </Field>

                  <Field label="Leader year" error={errors.leaderYear} className="sm:col-span-1">
                    <Input
                      value={values.leaderYear}
                      onChange={(e) => update("leaderYear", e.target.value)}
                      placeholder="3"
                      maxLength={20}
                      aria-invalid={!!errors.leaderYear}
                    />
                  </Field>

                  <Field label="Leader gender" error={errors.leaderGender} className="sm:col-span-1">
                    <Select value={values.leaderGender} onValueChange={(v) => update("leaderGender", v)}>
                      <SelectTrigger aria-invalid={!!errors.leaderGender}>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        {GENDER_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <div className="rounded-md border border-primary/30 bg-primary/10 px-3 py-2 text-sm text-primary">
                    Leader counts as member 1. Add the remaining {memberCount} member{memberCount === 1 ? "" : "s"} below.
                  </div>

                  {memberCount === 0 && (
                    <div className="rounded-md border border-border/60 bg-background/40 px-3 py-2 text-sm text-muted-foreground">
                      Solo teams skip this step. Add your idea pitch below.
                    </div>
                  )}

                  <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
                    {memberKeys.slice(0, memberCount).map((member) => (
                      <div key={`member-${member.number}`} className="contents">
                        <Field
                          label={`Member ${member.number} name`}
                          error={errors[member.nameKey]}
                          className="sm:col-span-1"
                        >
                          <Input
                            value={values[member.nameKey]}
                            onChange={(e) => update(member.nameKey, e.target.value)}
                            placeholder={`Member ${member.number} full name`}
                            maxLength={80}
                            aria-invalid={!!errors[member.nameKey]}
                          />
                        </Field>

                        <Field
                          label={`Member ${member.number} email`}
                          error={errors[member.emailKey]}
                          className="sm:col-span-1"
                        >
                          <Input
                            type="email"
                            value={values[member.emailKey]}
                            onChange={(e) => update(member.emailKey, e.target.value)}
                            placeholder={`member${member.number}@domain.com`}
                            maxLength={255}
                            aria-invalid={!!errors[member.emailKey]}
                          />
                        </Field>

                        <Field
                          label={`Member ${member.number} branch`}
                          error={errors[member.branchKey]}
                          className="sm:col-span-1"
                        >
                          <Input
                            value={values[member.branchKey]}
                            onChange={(e) => update(member.branchKey, e.target.value)}
                            placeholder="Computer Science"
                            maxLength={80}
                            aria-invalid={!!errors[member.branchKey]}
                          />
                        </Field>

                        <Field
                          label={`Member ${member.number} year`}
                          error={errors[member.yearKey]}
                          className="sm:col-span-1"
                        >
                          <Input
                            value={values[member.yearKey]}
                            onChange={(e) => update(member.yearKey, e.target.value)}
                            placeholder="3"
                            maxLength={20}
                            aria-invalid={!!errors[member.yearKey]}
                          />
                        </Field>

                        <Field
                          label={`Member ${member.number} gender`}
                          error={errors[member.genderKey]}
                          className="sm:col-span-2"
                        >
                          <Select
                            value={values[member.genderKey]}
                            onValueChange={(v) => update(member.genderKey, v)}
                          >
                            <SelectTrigger aria-invalid={!!errors[member.genderKey]}>
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                            <SelectContent>
                              {GENDER_OPTIONS.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </Field>
                      </div>
                    ))}

                    <Field
                      label="Idea pitch"
                      error={errors.ideaPitch}
                      hint={`${values.ideaPitch.length}/1000`}
                      className="sm:col-span-2"
                    >
                      <Textarea
                        value={values.ideaPitch}
                        onChange={(e) => update("ideaPitch", e.target.value)}
                        placeholder="In a sentence or two - what are you building?"
                        rows={5}
                        maxLength={1000}
                        aria-invalid={!!errors.ideaPitch}
                      />
                    </Field>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4 rounded-xl border border-border/60 bg-background/30 p-4">
                  <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    Review details before submit
                  </p>
                  <div className="grid gap-3 text-sm sm:grid-cols-2">
                    <ReviewItem label="Team Name" value={values.teamName} />
                    <ReviewItem label="Team Size" value={values.teamSize} />
                    <ReviewItem label="Track" value={trackLabel(values.track)} />
                    <ReviewItem label="College" value={values.collegeName} />
                    <ReviewItem label="Leader" value={values.leaderName} />
                    <ReviewItem label="Leader Email" value={values.leaderEmail} />
                    <ReviewItem label="Leader Phone" value={values.leaderPhone} />
                    <ReviewItem label="Leader Branch" value={values.leaderBranch} />
                    <ReviewItem label="Leader Year" value={values.leaderYear} />
                    <ReviewItem label="Leader Gender" value={genderLabel(values.leaderGender)} />
                    {memberKeys.slice(0, memberCount).map((member) => (
                      <ReviewItem
                        key={`review-${member.number}`}
                        label={`Member ${member.number}`}
                        value={`${values[member.nameKey]} · ${values[member.emailKey]} · ${values[member.branchKey]} · ${values[member.yearKey]} · ${genderLabel(values[member.genderKey])}`}
                      />
                    ))}
                    <div className="sm:col-span-2">
                      <ReviewItem label="Idea" value={values.ideaPitch} />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
                {step > 0 ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    className="w-full font-mono text-xs uppercase tracking-wider sm:w-auto"
                  >
                    Back
                  </Button>
                ) : (
                  <div className="hidden sm:block" />
                )}

                {step < STEPS.length - 1 ? (
                  <Button
                    type="button"
                    onClick={nextStep}
                    className="w-full font-mono text-xs uppercase tracking-wider shadow-glow sm:w-auto"
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    onClick={() => setSubmitArmed(true)}
                    disabled={status === "submitting"}
                    className="w-full font-mono text-xs uppercase tracking-wider shadow-glow sm:w-auto"
                  >
                    {status === "submitting" ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" /> Launching...
                      </>
                    ) : (
                      <>
                        <Rocket className="h-4 w-4" /> Submit registration
                      </>
                    )}
                  </Button>
                )}
              </div>

              <p className="text-center font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                By registering you agree to the NexTerra Orbit code of conduct.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

function ReviewItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
      <p className="mt-1 wrap-break-word text-foreground">{value || "-"}</p>
    </div>
  );
}

function trackLabel(track: string) {
  if (track === "ai") return "AI & Agents";
  if (track === "web3") return "Web3 & Infra";
  if (track === "climate") return "Climate Tech";
  if (track === "open") return "Open Innovation";
  return "-";
}

function genderLabel(gender: string) {
  if (gender === "male") return "Male";
  if (gender === "female") return "Female";
  if (gender === "other") return "Other";
  if (gender === "prefer_not_to_say") return "Prefer not to say";
  return "-";
}

function Field({
  label,
  error,
  hint,
  className,
  children,
}: {
  label: string;
  error?: string;
  hint?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={className}>
      <div className="mb-1.5 flex items-center justify-between">
        <Label className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          {label}
        </Label>
        {hint && <span className="font-mono text-[10px] text-muted-foreground">{hint}</span>}
      </div>
      {children}
      {error && <p className="mt-1.5 font-mono text-[11px] text-destructive">{error}</p>}
    </div>
  );
}
