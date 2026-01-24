# AI Delivery Copilot — Getting Started

## ✅ Status
Project **fully implemented and tested** ✓

- ✅ TypeScript compiles without errors
- ✅ All 18 Vitest tests pass
- ✅ Production build successful (284 KB bundled, 86 KB gzipped)
- ✅ 5 artifact types with Zod schemas
- ✅ 2 LLM providers (Mock + BYOK)
- ✅ Repair loop with 2 retry attempts
- ✅ UI components + state management
- ✅ Export to JSON/Markdown
- ✅ 3 demo briefs preconfigured

---

## 🚀 Quick Start (30 seconds)

```bash
cd ai-delivery-copilot

# 1. Start dev server
npm run dev
# Opens: http://localhost:5173

# 2. In browser:
# - Select artifact type (PRD, Backlog, RiskRegister, QAPack, CriticReport)
# - Load a demo brief from dropdown OR paste your own text
# - Click "Generate Artifact"
# - View JSON or Markdown tabs
# - Download or copy result
```

---

## 📦 What's Included

### Core Functionality
- **Artifact Generators**: Transform unstructured briefs into 5 types of structured outputs
- **Validation**: Zod schemas ensure outputs conform to contracts
- **Repair Loop**: Auto-fixes JSON validation errors (up to 2 retries)
- **Export Formats**: JSON (raw) + Markdown (formatted per type)
- **Provider Support**: Mock (for testing) + BYOK (bring your own API key)

### UI Components
- **Artifact Selector**: Choose from 5 types
- **Brief Input**: Textarea + 3 demo briefs dropdown
- **Provider Config Modal**: Switch providers, configure API keys
- **Output Viewer**: Tabbed (JSON/Markdown), copy/download buttons
- **Loading State**: Visual feedback during generation

### Testing (18 tests)
- Schema validation (5 types + discriminated union)
- Generator with repair loop
- Export to JSON/Markdown

---

## 📁 Project Structure

```
src/
├── app/App.tsx                  # Main layout
├── components/                  # 5 UI components
├── lib/
│   ├── schemas/artifacts.ts    # 5 Zod schemas
│   ├── llm/                    # Providers + generator
│   ├── prompts/                # Prompt templates
│   ├── export/                 # JSON/Markdown export
│   └── store.ts                # Zustand state

tests/
├── schemas.test.ts             # 7 tests
├── generator.test.ts           # 4 tests
└── export.test.ts              # 7 tests
```

---

## 🎯 How It Works

### Generation Flow

```
User Brief + Artifact Type
        ↓
Build Prompt
        ↓
Call LLM Provider (Mock or BYOK)
        ↓
Extract & Parse JSON
        ↓
Validate with Zod Schema
        ↓
Fail? Retry with repair prompt (max 2 times)
        ↓
Success → { artifact, raw }
        ↓
Export to JSON / Markdown
        ↓
Display in UI tabs
```

### Providers

**Mock Provider** (Default)
- Deterministic responses
- Perfect for testing/demos
- No API key required

**BYOK Provider** (Bring Your Own Key)
- Compatible with OpenAI API format
- Works with DeepSeek, OpenAI, LocalAI, etc
- Configure via UI modal (⚙ button in header)

---

## 🧪 Testing

```bash
# Run all tests once
npm test

# Watch mode (re-run on file change)
npm run test:watch

# Interactive test dashboard
npm run test:ui

# Expected output:
# ✓ tests/schemas.test.ts (7 tests)
# ✓ tests/generator.test.ts (4 tests)
# ✓ tests/export.test.ts (7 tests)
# Test Files: 3 passed (3)
# Tests: 18 passed (18)
```

---

## 🏗️ Building for Production

```bash
# Production build
npm run build

# Output: dist/
# - 0.47 kB HTML
# - 0.91 kB CSS
# - 284.49 kB JS (86.67 kB gzipped)

# Preview locally
npm run preview
# Opens: http://localhost:4173

# Deploy dist/ folder to:
# - Netlify
# - Vercel
# - GitHub Pages
# - Any static host (S3, etc)
```

---

## ⚙️ Configuration

### Environment Variables

Create `.env.local` (or configure in hosting provider):

```env
# Provider mode
VITE_LLM_PROVIDER=mock          # or "byok"

# BYOK settings (if using BYOK provider)
VITE_BYOK_API_BASE_URL=https://api.deepseek.com/v1
VITE_BYOK_API_KEY=sk_your_key_here
VITE_BYOK_MODEL=deepseek-chat
```

### Or Configure via UI

Click **⚙ Provider Config** button in header to set BYOK credentials without .env file.

---

## 📋 Artifact Types

### 1. PRD (Product Requirements Document)
**Input:** Unstructured brief about product vision  
**Output:** Structured PRD with problem, goals, requirements, metrics, risks

### 2. Backlog (Development Backlog)
**Input:** Feature/product description  
**Output:** Epics → Stories with user story format + acceptance criteria

### 3. RiskRegister (Risk Assessment)
**Input:** Project context/brief  
**Output:** Risk matrix with likelihood/impact, mitigation, owner, status

### 4. QAPack (QA Test Pack)
**Input:** Feature description  
**Output:** Test cases (happy path + edge cases), checklist

### 5. CriticReport (Critical Analysis)
**Input:** Brief or existing documentation  
**Output:** Gaps, ambiguities, inconsistencies, missing questions, recommendations

---

## 🎨 UI Walkthrough

### Header
- **Logo**: AI Delivery Copilot
- **⚙ Button**: Open Provider Configuration modal

### Left Panel (Input)
1. **Artifact Type Selector**: Dropdown with 5 types
2. **Demo Brief Loader**: Dropdown with 3 pre-built briefs (SaaS RBAC, Mobile Feedback, Internal Reporting)
3. **Brief Textarea**: Paste your unstructured brief (500-2000 chars)
4. **Generate Button**: Disabled during generation, shows "Generating..." state

### Right Panel (Output)
- **Tabs**: JSON | Markdown
- **Error Display**: Red box with error message if generation fails
- **Copy Button**: Copy selected tab to clipboard
- **Download Button**: Save as .json or .md file

### Provider Config Modal
- **Provider Selector**: Mock / BYOK
- **BYOK Fields** (when BYOK selected):
  - API Base URL (default: https://api.deepseek.com/v1)
  - API Key (password field)
  - Model Name (default: deepseek-chat)
- **Save / Cancel Buttons**

---

## 🔐 Security & Privacy Notes

✅ **100% Client-Side Processing**
- No data sent to backend (unless you configure BYOK)
- Brief text stays in your browser
- Generated artifacts cached locally

✅ **BYOK Mode**
- API key stored in browser localStorage only
- Never sent to project servers
- You control which LLM endpoint to use

✅ **Mock Mode**
- Fully offline, no API calls
- Deterministic responses (same brief = same output)
- Perfect for testing without incurring API costs

---

## 📖 Examples

### Example 1: Generate PRD from Brief

**Input (Brief):**
```
We need to build a mobile app that allows users to submit
feedback about our product. They should be able to add a title,
description, upload photos, and select a category (bug, feature,
general feedback). Feedback is reviewed by moderators and
marked approved/rejected.
```

**Click Generate** → Artifact Type: PRD

**Output (JSON):**
```json
{
  "artifactType": "PRD",
  "title": "User Feedback Collection Mobile App",
  "problemStatement": "Users have no in-app mechanism to submit structured feedback...",
  "goals": ["Enable user feedback collection", "Provide moderation workflow"],
  ...
}
```

**Click Markdown Tab:**
```markdown
# User Feedback Collection Mobile App

## Problem
Users have no in-app mechanism to submit structured feedback...

## Goals
- Enable user feedback collection
- Provide moderation workflow

...
```

### Example 2: Generate Backlog from Demo

1. Click **Quick Load Demo Brief** → Select "SaaS RBAC"
2. Brief auto-populates with RBAC scenario
3. Artifact Type: Backlog
4. Click **Generate Artifact**
5. Output: 2 epics (RBAC, Audit), 3 stories with estimates
6. Click **Download** → saves as `artifact-2026-01-23.md`

---

## 🚨 Common Issues & Fixes

### Issue: "npm run dev" fails
**Solution:**
```bash
npm install        # Reinstall deps
npm run dev
```

### Issue: BYOK provider returns 401 error
**Solution:**
- Check API key is correct in ⚙ Provider Config
- Verify baseUrl matches your LLM provider
- Ensure bearer token format is correct

### Issue: Generated JSON has extra fields
**Solution:**
- This is normal; Zod ignores extra keys
- Only required fields are validated
- Extra fields don't break the output

### Issue: Tests fail
**Solution:**
```bash
npm test                # Run once to see failures
npm run test:ui        # Visual dashboard for debugging
npm test -- --reporter=verbose
```

---

## 📚 Documentation

- **README_MVP.md**: Full feature documentation + architecture
- **IMPLEMENTATION_SUMMARY.md**: Technical details + build info
- **src/** files: Inline comments explaining each module

---

## 🎓 Development Workflow

### Add a New Artifact Type (Example: BudgetPlan)

1. **Define Schema** in `src/lib/schemas/artifacts.ts`:
   ```typescript
   export const BudgetPlanSchema = z.object({
     artifactType: z.literal("BudgetPlan"),
     totalBudget: z.number().positive(),
     ...
   });
   ```

2. **Add Mock Data** in `src/lib/llm/mockProvider.ts`:
   ```typescript
   BudgetPlan: { artifactType: "BudgetPlan", totalBudget: 100000, ... }
   ```

3. **Add Prompt** in `src/lib/prompts/index.ts`:
   ```typescript
   BudgetPlan: "Generate a budget plan JSON with..."
   ```

4. **Add Markdown Export** in `src/lib/export/markdownExport.ts`:
   ```typescript
   case "BudgetPlan":
     return `# Budget Plan\n...`
   ```

5. **Test**: Add tests in `tests/schemas.test.ts`

---

## 🚀 Deployment Checklist

- [ ] Run `npm test` (all tests pass)
- [ ] Run `npm run build` (no errors)
- [ ] Review `dist/` output
- [ ] Set environment variables (if using BYOK)
- [ ] Deploy `dist/` folder to hosting provider
- [ ] Test in production (click Generate, verify output)
- [ ] Document deployed URL

---

## 📞 Support

- **Local Issues**: Check terminal output, run `npm test`
- **LLM Issues**: Verify API key + endpoint in ⚙ config
- **Feature Requests**: Refer to v1.1 roadmap in README_MVP.md

---

## 🎉 You're Ready!

```bash
# Start developing
npm run dev

# Or build for production
npm run build

# Then deploy!
```

**Enjoy AI Delivery Copilot!** 🚀

---

*Last Updated: January 23, 2026 | Version: 0.1.0 (MVP)*
