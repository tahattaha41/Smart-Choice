# Smart Choice — standalone site (experimental branch)

Zero-dependency static site (Node 22): comparison engine, decision center, 3 calculators, bilingual AR/EN, local articles in `content/articles/`.

    cd web && node --test test/*.test.mjs   # 32+ unit tests
    SKIP=1 node build.mjs                    # output: web/dist
    # e2e: serve dist under /Smart-Choice and run: node scripts/e2e.mjs

Product data in `src/data/products.json` is **demo data**, clearly labeled; replace with real sourced data before launch. Set `CONTACT_EMAIL` at build time. Not deployed: Blogger remains the live site until the owner decides.
