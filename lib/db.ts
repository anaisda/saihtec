/**
 * lib/db.ts — Vercel-compatible version
 * Uses filesystem when available (local/VPS), falls back to in-memory defaults (Vercel)
 */

const DEFAULT_CONTENT = {
  settings: {
    heroTagline: "Stockholm, Sweden · GMP Certified · ISCT Member",
    heroTitle: "The future of cellular therapy starts here.",
    heroSubtitle: "SAIHTEC AB develops and manufactures clinical-grade mesenchymal stromal cells, driving the translation of cell therapy from research to patients worldwide.",
    heroVideoUrl: "https://videos.pexels.com/video-files/8325997/8325997-hd_1920_1080_30fps.mp4",
    stats: [
      { number: "20", suffix: "+", label: "Years of MSC Research" },
      { number: "57", suffix: "", label: "Peer-Reviewed Publications" },
      { number: "3", suffix: "", label: "Active Clinical Programmes" },
      { number: "GMP", suffix: "", label: "Certified Manufacturing" }
    ],
    seoTitle: "SAIHTEC AB — Advanced Stem Cell Therapeutics · Stockholm, Sweden",
    seoDescription: "SAIHTEC AB develops and manufactures clinical-grade mesenchymal stromal cells. Founded in Sweden. GMP certified.",
    contactEmail: "nadir.kadri@ki.se"
  },
  about: {
    tagline: "Who we are",
    title: "Science-led. Patient-driven. Built in <em>Sweden</em>.",
    highlightQuote: "Our purpose is to improve lives through safe and effective cell therapy — and to drive its clinical translation worldwide.",
    body: "SAIHTEC AB is a Swedish biotechnology company founded by Dr. Nadir Kadri, an immunologist and stem cell researcher with over 20 years of experience at Karolinska Institutet, Stockholm. The company is built on two decades of peer-reviewed science and multiple investigator-initiated clinical trials, translating mesenchymal stromal cell therapy from the laboratory to the clinic.",
    vision: "To improve lives through safe and effective cell therapy.",
    mission: "To drive clinical translation of cell therapies worldwide.",
    certifications: ["GMP Certified Manufacturing — Sweden","EU ATMP Regulatory Framework","ISCT MSC Committee Member 2025–2028","57 Peer-Reviewed Publications"]
  },
  technology: [
    { id:"t1",order:1,number:"01",title:"MSC Isolation & Expansion",description:"Bone marrow-derived mesenchymal stromal cells isolated and expanded under rigorously controlled, serum-free conditions to ensure consistency, purity and potency across every batch." },
    { id:"t2",order:2,number:"02",title:"GMP Manufacturing",description:"End-to-end production of clinical-grade cell therapy products under EU Good Manufacturing Practice guidelines, ensuring every product meets the regulatory standards required for human use." },
    { id:"t3",order:3,number:"03",title:"Quality Control & Release",description:"Comprehensive release testing — sterility, viability, immunophenotyping and functional potency assays — performed before any product leaves our facility." },
    { id:"t4",order:4,number:"04",title:"Clinical Translation",description:"Direct collaboration with academic medical centres and clinical investigators to design and execute Phase I and Phase II trials, from protocol development to regulatory submission." },
    { id:"t5",order:5,number:"05",title:"Regulatory Affairs",description:"Expert navigation of EU ATMP classification, EMA submissions and CMC documentation, underpinned by direct experience as principal investigator on multiple approved clinical trials." },
    { id:"t6",order:6,number:"06",title:"Cryopreservation & Logistics",description:"Validated cryopreservation protocols and temperature-controlled logistics ensure cell viability and potency are maintained throughout distribution to clinical sites." }
  ],
  pipeline: [
    { id:"cl1",order:1,name:"MSC in Chronic GvHD",subtitle:"Bone Marrow MSC",phase:"Phase II",phasePercent:75,indication:"Chronic Graft-versus-Host Disease",status:"Active" },
    { id:"cl2",order:2,name:"MSC in Progressive MS",subtitle:"Bone Marrow MSC",phase:"Phase I",phasePercent:40,indication:"Progressive Multiple Sclerosis",status:"Completed" },
    { id:"cl3",order:3,name:"MSC in Vocal Fold Scarring",subtitle:"Local MSC Administration",phase:"Phase I/IIa",phasePercent:60,indication:"Vocal Fold Scarring & Dysphonia",status:"Active" }
  ],
  team: [
    { id:"m1",order:1,name:"Dr. Nadir Kadri",initials:"NK",title:"PhD, VMD — Founder & CEO",bio:"Immunologist and stem cell researcher. Assistant Professor at Karolinska Institutet. Elected member of the ISCT MSC Committee (2025–2028). Principal Investigator on multiple Phase I/II clinical trials. 57 peer-reviewed publications. ORCID: 0000-0003-2623-4094.",linkedinUrl:"",color:"#1C3D4A" }
  ],
  publications: [
    { id:"pub1",year:"2026",title:"An open phase I/IIa study evaluating safety, patient-reported outcomes and voice function after surgery, local administration of mesenchymal stromal cells and voice training in patients with vocal fold scarring and dysphonia",authors:"Bergström Börlin E, Nygren U, Södersten M, Granqvist S, Kadri N, Le Blanc K, Hertegård S.",journal:"Stem Cell Research & Therapy. 2026 Apr 19;17(1):146",url:"https://doi.org/10.1186/s13287-026-05022-4",urlType:"DOI" },
    { id:"pub2",year:"2025",title:"ISCT MSC committee statement on the US FDA approval of allogenic bone-marrow mesenchymal stromal cells",authors:"Le Blanc K, Dazzi F, English K, Kadri N, Krampera M, et al.",journal:"Cytotherapy, 2025",url:"https://pubmed.ncbi.nlm.nih.gov/39864015",urlType:"PubMed" },
    { id:"pub3",year:"2023",title:"Current perspectives on mesenchymal stromal cell therapy for graft versus host disease",authors:"Kadri N, Amu S, Iacobaeus E, Boberg E, Le Blanc K.",journal:"Cellular and Molecular Immunology, 2023",url:"https://pubmed.ncbi.nlm.nih.gov/37165014",urlType:"PubMed" },
    { id:"pub4",year:"2020",title:"Treatment of chronic GvHD with mesenchymal stromal cells induces durable responses: A phase II study",authors:"Boberg E, von Bahr L, Afram G, Lindström C, Ljungman P, Kadri N, Le Blanc K.",journal:"Stem Cells Translational Medicine. 2020;9(10):1190–1202",url:"https://pubmed.ncbi.nlm.nih.gov/32573983",urlType:"PubMed" },
    { id:"pub5",year:"2019",title:"Short and Long Term Clinical and Immunologic Follow up after Bone Marrow Mesenchymal Stromal Cell Therapy in Progressive Multiple Sclerosis — A Phase I Study",authors:"Iacobaeus E, Kadri N, Lefsihane K, Boberg E, Gavin C, Törnqvist Andrén A, Lilja A, Brundin L, Blanc KL.",journal:"Journal of Clinical Medicine. 2019;8(12):2102",url:"https://pubmed.ncbi.nlm.nih.gov/31810187",urlType:"PubMed" }
  ],
  news: [
    { id:"n1",title:"SAIHTEC AB announces strategic partnership with Saidal Group",slug:"saihtec-saidal-partnership",date:"2024-11-15",category:"Partnership",excerpt:"SAIHTEC AB has entered into a strategic collaboration with Saidal Group, Algeria's leading pharmaceutical company, to advance access to cell therapy across North Africa and the MENA region.",body:"",coverImage:"https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=900" },
    { id:"n2",title:"Phase I/IIa trial results published in Stem Cell Research & Therapy",slug:"vocal-fold-trial-publication-2026",date:"2026-04-19",category:"Clinical Trial",excerpt:"New peer-reviewed publication reports safety and patient outcomes from the Phase I/IIa study evaluating local MSC administration in patients with vocal fold scarring and dysphonia.",body:"",coverImage:"https://images.pexels.com/photos/3938022/pexels-photo-3938022.jpeg?auto=compress&cs=tinysrgb&w=900" },
    { id:"n3",title:"Dr. Nadir Kadri elected to ISCT MSC Committee 2025–2028",slug:"isct-committee-election-2025",date:"2025-01-10",category:"Company News",excerpt:"SAIHTEC founder Dr. Nadir Kadri has been elected as one of 14 global experts to serve on the ISCT MSC Committee for the 2025–2028 term.",body:"",coverImage:"https://images.pexels.com/photos/3786215/pexels-photo-3786215.jpeg?auto=compress&cs=tinysrgb&w=900" },
    { id:"n4",title:"ISCT MSC Committee statement on FDA approval of allogenic bone-marrow MSCs",slug:"isct-fda-approval-statement-2025",date:"2025-03-05",category:"Publication",excerpt:"Co-authored statement published in Cytotherapy addressing the US FDA approval of allogenic bone-marrow mesenchymal stromal cells.",body:"",coverImage:"https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg?auto=compress&cs=tinysrgb&w=900" }
  ],
  faq: {
    tagline:"Frequently Asked",
    items:[
      { id:"f1",q:"What does SAIHTEC AB do?",a:"SAIHTEC AB is a Swedish biotechnology company that develops and manufactures clinical-grade mesenchymal stromal cells (MSCs) for use in clinical research and therapeutic programmes." },
      { id:"f2",q:"How can I collaborate with SAIHTEC?",a:"We welcome partnerships with academic institutions, clinical investigators, hospitals and industry partners. Please reach out via our contact form." },
      { id:"f3",q:"What clinical areas are you working in?",a:"Our investigator-initiated clinical trials have focused on Graft-versus-Host Disease (GvHD), Progressive Multiple Sclerosis, and vocal fold disorders." },
      { id:"f4",q:"Are your manufacturing processes GMP certified?",a:"Yes. Our manufacturing follows EU Good Manufacturing Practice (GMP) guidelines under the ATMP regulatory framework." },
      { id:"f5",q:"How do I contact SAIHTEC for investor inquiries?",a:"Please use the contact form on this website and select 'Investor Relations' as the inquiry type." }
    ]
  },
  science_team: null,
  investors: null,
  collaborations: null,
  media: null,
  events: null
}

// ── Safe filesystem operations (won't crash on Vercel) ──
function tryReadFile(filePath: string): any | null {
  try {
    const fs = require('fs')
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, 'utf-8'))
    }
  } catch {}
  return null
}

function tryWriteFile(filePath: string, data: any): void {
  try {
    const fs = require('fs')
    const path = require('path')
    const dir = path.dirname(filePath)
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8')
  } catch {}
}

function getDataPath(file: string): string {
  try {
    const path = require('path')
    return path.join(process.cwd(), 'data', file)
  } catch {
    return ''
  }
}

// ── Public API ──
export function readContent(): any {
  const data = tryReadFile(getDataPath('content.json'))
  return data || DEFAULT_CONTENT
}

export function writeContent(data: any): void {
  tryWriteFile(getDataPath('content.json'), data)
}

export function readAdmin(): any {
  const data = tryReadFile(getDataPath('admin.json'))
  if (data) return data
  const bcrypt = require('bcryptjs')
  return {
    users: [{ id:'1', email:'admin@saihtec.com', password: bcrypt.hashSync('admin123', 10), name:'Admin', role:'superadmin' }]
  }
}

export function writeAdmin(data: any): void {
  tryWriteFile(getDataPath('admin.json'), data)
}