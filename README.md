# Receiptly

This is a simple web application which allows users to upload receipt images or PDFs, add metadata (merchant, amount, date, category), and view/filter their uploaded receipts.

The project is built with **Next.js**, **Supabase**, and deployed on **Vercel**.



## Core Features

* **File Uploads:** Upload receipt images (JPG, PNG) and PDFs.
* **Data Entry:** Add details for each receipt: merchant, amount, date, and category.
* **Receipt List:** View all submitted receipts in a clean, filterable list.
* **Category Filtering:** Filter the receipt list by category (e.g., "Food", "Travel", "Supplies", "Software", "Other").
* **File Viewing:** Click a receipt to view the original uploaded image or PDF.
* **Delete:** Remove receipts you no longer need.
* **Persistence:** All receipt data is saved in a PostgreSQL database and files are stored in a cloud bucket, provided by Supabase.

## 💻 Tech Stack

* **Frontend:** [Next.js](https://nextjs.org/) (React Framework)
* **Backend (BaaS):** [Supabase](https://supabase.io/)
    * **Database:** Supabase Postgres for metadata.
    * **Storage:** Supabase Storage for file uploads (images/PDFs).
* **Deployment:** [Vercel](https://vercel.com/)
* **Styling:** (e.g., Tailwind CSS, Shadcn)

---

## 🚀 Setup and Running Instructions

Follow these steps to get the project running locally.

### Prerequisites

* [Node.js](https://nodejs.org/)
* [npm](https://www.npmjs.com/)
* A [Supabase](https://supabase.com/) account (free tier is sufficient)
* A [Vercel](https://vercel.com/) account (for deployment)

### 1. Backend Setup (Supabase)

1.  **Create a Supabase Project:**
    * Go to your [Supabase Dashboard](https://supabase.com/dashboard) and create a new project.
    * Once created, navigate to **Project Settings** > **API**.
    * Save your **Project URL** and **`anon` (public) key**. You will need these for your `.env` file.

2.  **Create the Database Table:**
    * In your Supabase project dashboard, go to the **Table Editor**.
    * Click "**Create a new table**".
    * Name the table `receipts`.
    * For this application, you can **uncheck** "**Enable Row Level Security (RLS)**". (For a real-world application, you would keep this enabled and create security policies).
    * Add the following columns using the UI, matching the names and types:
        * `id`: `uuid` (this is the default primary key, just ensure it's set to `gen_random_uuid()` as its default)
        * `merchant`: `text` (set as `NOT NULL`)
        * `amount`: `float8` (set as `NOT NULL`)
        * `date`: `timestamptz` (set as `NOT NULL`)
        * `category`: `text`
        * `receipt_image_url`: `text`
        * `created_at`: `timestamptz` (set the default value to `now()`)
    * Click **Save** to create the table.
    * (Alternatively, you can use the **SQL Editor** and find table creation guides in the [Supabase documentation](https://supabase.com/docs/guides/database/tables)).

3.  **Create the Storage Bucket:**
    * In your Supabase project dashboard, navigate to the **Storage** section.
    * Click "**New bucket**".
    * Name the bucket `receipt_imgs`.
    * For this project, we need the bucket to be public for easy uploading and viewing. Click the `...` on your new bucket and select "**Bucket settings**".
    * Toggle **"Make bucket public"** to **On**.
    * Next, go to the **Policies** tab for your `receipt_imgs` bucket. You need to create policies to allow the app to upload (`INSERT`) and delete (`DELETE`) files.
    * Click "**New policy**" and create a policy for **uploads** (`INSERT`) and another for **deletions** (`DELETE`). For this simple application, you can set them to be public (anonymous).
    * For more detailed instructions, please refer to the [Supabase Storage Policies documentation](https://supabase.com/docs/guides/storage/security/access-control).

### 2. Local Frontend Setup

1.  **Clone the Repository:**
    ```bash
    git clone https://github.com/ducminh02/Receiptly
    cd Receiptly
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    ```

3.  **Create Environment File:**
    * Create a file named `.env` in the root of the project.
    * Add your Supabase project URL and anon key:

    ```.env
    NEXT_PUBLIC_SUPABASE_URL=YOUR_PROJECT_URL
    NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_PROJECT_ANON_KEY
    ```

4.  **Run the Development Server:**
    ```bash
    npm run dev
    ```
    The application should now be running at `http://localhost:3000`.

### 3. Deployment (Vercel)

1 Click deployment with [Vercel](https://vercel.com/)
