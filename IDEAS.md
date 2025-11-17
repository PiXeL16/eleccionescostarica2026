## New Analysis Features for Voter Decision-Making (November 2025)

### 🎯 1. Party Matcher Quiz (Future Priority)
**Goal:** Help voters discover which parties align with their values

**Features:**
- 10-15 key questions across major policy categories
- Users rank importance of each issue (1-5 scale)
- Algorithm matches users to parties based on actual platform positions
- Shows % match with each party
- Highlights key agreement/disagreement areas
- Shareable results for social media

**Technical Approach:**
- Weight user answers by importance ranking
- Calculate cosine similarity between user vector and party position vectors
- Use existing embeddings for semantic matching

### 📍 2. Ideological Spectrum Map ⭐ IN PROGRESS
**Goal:** Visualize where parties actually sit on policy axes

**Features:**
- 2D scatter plot: Economic (left-right) vs Social (conservative-progressive)
- Position parties based on actual proposals (not labels or self-identification)
- Interactive: click party to see positioning rationale
- "Where am I?" feature for users to plot themselves
- Color-coded by party
- Mobile-responsive with touch interactions

**Technical Approach:**
- Analyze economic proposals for market vs. state intervention keywords
- Analyze social proposals for progressive vs. conservative positions
- Calculate positioning scores from text analysis
- Use D3.js or Recharts for interactive visualization

### 📊 3. Specificity Score ⭐ IN PROGRESS
**Goal:** Measure how concrete vs. vague party proposals are

**Features:**
- Score each party on: Budget transparency, Timeline specificity, Implementation details
- Bar chart comparing "vagueness vs. specificity" across parties
- Category-level breakdown (which topics get specific proposals?)
- Highlight most/least specific proposals with examples

**Metrics to Analyze:**
- Presence of numbers, percentages, dollar amounts
- Timeline mentions (años, meses, "primer año")
- Action verbs vs. vague language ("implementaremos" vs. "buscaremos")
- Concrete mechanisms vs. aspirational goals

**Technical Approach:**
- NLP analysis of proposal text
- Regex patterns for numbers, dates, budgets
- Keyword scoring for concrete vs. vague language
- Aggregate scores by party and category

### 🔥 4. Cross-Party Agreement Heatmap ⭐ IN PROGRESS
**Goal:** Show consensus issues vs. divisive topics

**Features:**
- Matrix showing which parties agree on which categories
- Color intensity = level of agreement (text similarity)
- Reveals: "15 parties agree on healthcare" vs. "Huge split on economic policy"
- Click cells to see specific areas of agreement/disagreement
- Summary stats: "Most consensus on...", "Most divided on..."

**Technical Approach:**
- Use existing embeddings to calculate similarity between party positions per category
- Cosine similarity matrix for each category
- Heatmap visualization with tooltips
- Threshold-based highlighting for high/low agreement

### 👔 5. Candidate Experience Dashboard ⭐ IN PROGRESS
**Goal:** Compare candidate qualifications objectively

**Features:**
- Visualize candidate backgrounds: public sector years, private sector, academic, political positions
- Include running mates (VP1, VP2) comparison
- Filter by: ministerial experience, legislative experience, executive roles
- Timeline view of career progression
- Education credentials comparison
- Age and generational analysis

**Data Source:**
- profiles.json already has: profession, age, education, profile_description
- running_mates table in database

**Visualizations:**
- Stacked bar chart: years in different sectors
- Network diagram: connections and roles
- Table view with sortable columns

### 🔍 6. What's Missing Analysis ⭐ IN PROGRESS
**Goal:** Highlight which parties avoid certain topics

**Features:**
- Category coverage heatmap per party
- "Silence Score" - which topics get zero/minimal coverage
- Shows priorities (20 proposals) vs. gaps (0 proposals)
- Examples: "Party X: 20 education proposals, 0 environment proposals"
- Sort parties by most/least comprehensive platforms

**Technical Approach:**
- Count proposals per category per party
- Normalize by total word count (some parties write more)
- Highlight empty categories
- Calculate "coverage completeness" score

### 🔎 7. Keyword Explorer (Leverage Existing Semantic Search) ⭐ IN PROGRESS
**Goal:** Find which parties discuss specific user concerns

**Features:**
- Search any keyword or phrase
- Semantic search using existing embeddings
- Results ranked by relevance with context snippets
- Visual timeline: how much each party mentions the topic
- Related keywords suggestion
- Export search results

**Technical Approach:**
- Use existing sqlite-vec embeddings
- Enhance current AI chat with dedicated search UI
- Add "Compare all parties on this topic" feature
- Highlight matching text snippets

### 🗺️ 8. Interactive Word Bubble Map ⭐ IN PROGRESS
**Goal:** Visual representation of each party's key themes at a glance

**Features:**
- Force-directed graph with party nodes
- Each party has a bubble with word cloud of their top keywords
- Bubble size = total proposal count or word count
- Word size within bubble = frequency in that party's platform
- Hover to see larger view
- Click party to navigate to full profile
- Color-coded by ideology or category focus
- Mobile-responsive with pinch-zoom

**Visualization Approach:**
- D3.js force simulation for bubble layout
- SVG text for word clouds within circles
- Interactive tooltips and navigation
- Animated transitions when filtering/zooming

**Technical Approach:**
- Extract top 15-20 keywords per party from all proposals
- TF-IDF to find distinctive words (not just common words)
- Calculate bubble sizes based on platform length
- Force layout to prevent overlap

### 🎓 10. Simplicity Dashboard ⭐ IN PROGRESS
**Goal:** Make platforms accessible to all voters

**Features:**
- "ELI5" (Explain Like I'm 5) summary for each party's top 5 priorities
- Visual icons + one-sentence explanations
- Reading level analysis (Flesch-Kincaid score)
- Translation to simpler Spanish
- Accessibility score per party
- "Quick Facts" mode: bullet points only

**Technical Approach:**
- LLM-powered summarization of complex proposals
- Readability metrics (sentence length, word complexity)
- Manual curation of top priorities from each platform
- Icon library for common policy areas

---

**Implementation Priority (November 2025):**

**Week 1-2:**
- ✅ Ideological Spectrum Map
- ✅ Interactive Word Bubble Map

**Week 3-4:**
- Specificity Score
- What's Missing Analysis

**Week 5-6:**
- Cross-Party Agreement Heatmap
- Candidate Experience Dashboard

**Week 7-8:**
- Keyword Explorer enhancement
- Simplicity Dashboard

**Future (3+ months):**
- Party Matcher Quiz (requires user research)
- Promise Tracker (post-election feature)
- Budget Reality Check (needs economic expertise)

---

**Last Updated:** November 2025

**Contributing:** Have an idea? Open an issue on GitHub or submit a pull request!
