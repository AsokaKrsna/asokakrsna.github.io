## 🔧 How to Update Different Sections

### 1. Personal Information

**Location in JSON:** `personal` section

```json
"personal": {
  "name": "Durjoy Majumdar",
  "alias": "AsokaKrsna",
  "title": "Cybersec Nerd | Researcher | Student",
  "tagline": "Cybersecurity is a mindset, not a product.",
  "profileImage": "images/profile.png",
  "favicon": "./images/AsokaKrsna.ico",
  "resumeLink": "Resume.pdf"
}


### 2. About Section

**Location in JSON:** `about` section

```json
"about": {
  "paragraphs": [
    "Hello! I'm Durjoy...",
    "My interest in cybersecurity...",
    "Driven by an insatiable curiosity..."
  ]
}
```

**How to update:**
- Each string in the array is a paragraph
- Add more strings to add more paragraphs
- Use HTML tags like `<a href="#">links</a>` inside the text

---

### 3. Adding/Editing Experience

**Location in JSON:** `experience` array

**To add a new experience:**

```json
{
  "period": "Nov'24 - Present",
  "title": "Your Job Title",
  "company": "Company Name",
  "location": "[City, Country]",
  "responsibilities": [
    "First responsibility",
    "Second responsibility",
    "Third responsibility"
  ]
}
```

**Steps:**
1. Copy the template above
2. Add it to the `experience` array
3. Fill in information
4. Separate responsibilities with commas in the array

---

### 4. Adding/Editing Projects

**Location in JSON:** `projects` array

**To add a new project:**

```json
{
  "title": "Project Name",
  "description": "Project description here...",
  "technologies": ["HTML", "CSS", "JavaScript"],
  "githubUrl": "https://github.com/yourusername/repo",
  "liveUrl": "https://yourproject.com"
}
```

**Steps:**
1. Copy the template above
2. Add it to the `projects` array
3. List all technologies used
4. Use `"#"` for unavailable links

---

### 5. Adding/Editing Research Papers

**Location in JSON:** `research` array

**To add a new paper:**

```json
{
  "date": "Dec'24",
  "publication": "Conference Name | Publisher",
  "title": "Paper Title",
  "description": "Abstract or description of the paper...",
  "url": "https://link-to-paper.com",
  "hidden": false
}
```

**Note:** Set `"hidden": true` to hide the paper initially (will show after clicking "See More")

---

### 6. Adding/Editing Blog Posts

**Location in JSON:** `blogs` array

**To add a new blog:**

```json
{
  "date": "Jan 22, 2025",
  "title": "Blog Title",
  "url": "https://blog.com/post"
}
```

**Steps:**
1. Copy the template
2. Add to the top of the `blogs` array (newest first)
3. Update date, title, and URL

---

### 7. Updating Certifications

**Location in JSON:** `certifications` array

**To add a new certification:**

```json
{
  "name": "Certification Name",
  "date": "Jan'25"
}
```

**Note:** Add new certifications at the top of the array to show them first

---

### 8. Updating Achievements

**Location in JSON:** `achievements` array

**To add a new achievement:**

Simply add a new string to the array:

```json
"achievements": [
  "Your new achievement here...",
  "Another achievement...",
  "Existing achievement..."
]
```

---

### 9. Updating Contact Information

**Location in JSON:** `contact` section

```json
"contact": {
  "description": "I'm currently looking for...",
  "phone": "+917810976687",
  "emails": [
    "email1@example.com",
    "email2@example.com"
  ],
  "calendlyUrl": "https://calendly.com/yourlink"
}
```

---

### 10. Updating Social Links

**Location in JSON:** `socialLinks` array

**To add/edit a social link:**

```json
{
  "platform": "Platform Name",
  "icon": "fab fa-icon-name",
  "url": "https://yourprofile.com"
}
```

**Common icons:**
- LinkedIn: `fab fa-linkedin-in`
- Twitter/X: `fab fa-twitter`
- GitHub: `fab fa-github`
- Instagram: `fab fa-instagram`
- Facebook: `fab fa-facebook-f`

---

## ⚠️ Important Tips

### JSON Formatting Rules:

1. **Always use double quotes** `"` not single quotes `'`
   - ✅ Correct: `"name": "Durjoy"`
   - ❌ Wrong: `'name': 'Durjoy'`

2. **Add commas between items** (but not after the last item)
   - ✅ Correct: `{"a": 1, "b": 2}`
   - ❌ Wrong: `{"a": 1, "b": 2,}`

3. **Arrays need square brackets** `[]`
   - ✅ Correct: `"skills": ["HTML", "CSS"]`
   - ❌ Wrong: `"skills": "HTML", "CSS"`

4. **Use a JSON validator** incase:
   - https://jsonlint.com/


## 🚨 Troubleshooting

### Problem: Website not updating after changes

**Solution:**
1. Clear browser cache (Ctrl + Shift + Delete)
2. Hard refresh (Ctrl + F5)
3. Check if the JSON file was saved properly

### Problem: Website shows nothing or broken content

**Solution:**
1. Open browser console (F12)
2. Look for error messages in red
3. Most likely a JSON syntax error - validate at jsonlint.com
4. Common mistakes:
   - Missing comma between items
   - Extra comma after last item
   - Using single quotes instead of double quotes
   - Unclosed brackets `[]` or braces `{}`

### Problem: Special characters not showing correctly

**Solution:**
- Make sure JSON file is saved with UTF-8 encoding
- In most editors: File → Save with Encoding → UTF-8

---
