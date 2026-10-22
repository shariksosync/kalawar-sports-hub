import { createFileRoute } from "@tanstack/react-router";
import { BUSINESS } from "@/data/mock";
import { Icon, PageHero, Section } from "@/components/kit";
import { RegisterForm, Site, seo } from "@/components/site";

export const Route = createFileRoute("/contact")({
  head: () => seo("Contact Us", "Contact KALAWAR Sports in Shiroli, Kolhapur, Maharashtra — phone, email and enquiry form."),
  component: Contact,
});

function Contact() {
  return (
    <Site>
      <PageHero title="Contact Us" sub={BUSINESS.hq} />
      <Section title="We're here to help">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-4">
            <div className="card p-6"><p className="flex gap-2"><Icon name="pin" className="h-5 w-5 shrink-0 text-primary" />{BUSINESS.address}</p></div>
            <div className="card space-y-3 p-6">{BUSINESS.phones.map((p) => <a key={p} href={`tel:${p.replace(/\s/g, "")}`} className="flex items-center gap-2 font-semibold hover:text-primary"><Icon name="phone" className="h-5 w-5 text-primary" />{p}</a>)}<a href={`mailto:${BUSINESS.email}`} className="flex items-center gap-2 font-semibold hover:text-primary"><Icon name="mail" className="h-5 w-5 text-primary" />{BUSINESS.email}</a></div>
            <div className="card p-6 text-sm"><p><b>Founder & President:</b> {BUSINESS.founder}</p><p><b>Director:</b> {BUSINESS.director}</p></div>
          </div>
          <div className="card p-6"><h3 className="mb-4 text-2xl font-bold uppercase">Send an enquiry</h3><RegisterForm title="Contact form" kind="Contact enquiry" extra={[{ name: "subject", label: "Subject", type: "select", options: ["General", "Academy affiliation", "Gym registration", "Shop order", "Partnership"], required: true }, { name: "msg", label: "Message", type: "textarea", required: true }]} /></div>
        </div>
      </Section>
    </Site>
  );
}
