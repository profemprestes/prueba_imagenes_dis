#!/bin/bash
set -e

echo "Installing deps..."
npm install next@latest @supabase/ssr@latest postcss @tailwindcss/postcss @types/react @types/react-dom
npm uninstall vite @vitejs/plugin-react @tailwindcss/vite

echo "Updating package.json..."
node -e "
const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
pkg.scripts = {
  'dev': 'next dev',
  'build': 'next build',
  'start': 'next start',
  'lint': 'next lint'
};
fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
"

echo "Updating tsconfig.json..."
node -e "
const fs = require('fs');
const tsconfig = JSON.parse(fs.readFileSync('tsconfig.json', 'utf8'));
tsconfig.compilerOptions = {
  ...tsconfig.compilerOptions,
  jsx: 'preserve',
  plugins: [{ 'name': 'next' }],
  strict: true,
  forceConsistentCasingInFileNames: true,
  esModuleInterop: true,
  resolveJsonModule: true,
  incremental: true,
  paths: { '@/*': ['./src/*'] }
};
tsconfig.include = ['next-env.d.ts', '**/*.ts', '**/*.tsx', '.next/types/**/*.ts'];
tsconfig.exclude = ['node_modules'];
fs.writeFileSync('tsconfig.json', JSON.stringify(tsconfig, null, 2));
"

echo "Configuring postcss & globals.css..."
cat << 'MJS' > postcss.config.mjs
export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
MJS

mkdir -p src/app
mv index.css src/app/globals.css

echo "Creating layout..."
cat << 'TSX' > src/app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Luminous - The Radiant Curator',
  description: 'AI-powered mockup visualization',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
TSX

echo "Moving and fixing App.tsx -> page.tsx..."
node -e "
const fs = require('fs');
let content = fs.readFileSync('App.tsx', 'utf8');
content = '\"use client\";\n\n' + content;
content = content.replace(/from '\.\/components\//g, \"from '@/components/\");
content = content.replace(/from '\.\/services\//g, \"from '@/services/\");
content = content.replace(/from '\.\/types'/g, \"from '@/types'\");
content = content.replace(/from '\.\/PromptBuilderPage'/g, \"from '@/PromptBuilderPage'\");
content = content.replace(/from '\.\/src\/components\//g, \"from '@/components/\");
content = content.replace(\"import '@google/model-viewer';\", \"// import '@google/model-viewer';\");
fs.writeFileSync('src/app/page.tsx', content);
"

rm App.tsx vite.config.ts index.html index.tsx

echo "Configuring Supabase SSR..."
mkdir -p src/lib/supabase
cat << 'TSX' > src/lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr';
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
TSX

cat << 'TSX' > src/lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet) {
          try { cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options)); }
          catch (error) {}
        },
      },
    }
  );
}
TSX

echo "Moving src directories..."
mkdir -p src/services src/lib
cp -r components/* src/components/ 2>/dev/null || true
cp -r lib/* src/lib/ 2>/dev/null || true
cp -r services/* src/services/ 2>/dev/null || true
cp types.ts src/types.ts
cp PromptBuilderPage.tsx src/PromptBuilderPage.tsx
rm -rf components lib services PromptBuilderPage.tsx types.ts

echo "Fixing TypeScript errors..."

node -e "
const fs = require('fs');
let file = 'src/PromptBuilderPage.tsx';
let text = fs.readFileSync(file, 'utf8');
text = text.replace(/onValueChange=\{setSelectedComponent\}/g, 'onValueChange={(val: any) => setSelectedComponent(val || \"\")}');
text = text.replace(/onValueChange=\{setSelectedAction\}/g, 'onValueChange={(val: any) => setSelectedAction(val || \"\")}');
fs.writeFileSync(file, text);
"

node -e "
const fs = require('fs');
let file = 'src/components/home/featured-products.tsx';
let text = fs.readFileSync(file, 'utf8');
text = text.replace(/const itemVariants = \{/g, 'const itemVariants: any = {');
fs.writeFileSync(file, text);
"

node -e "
const fs = require('fs');
let file = 'src/components/home/hero-section.tsx';
let text = fs.readFileSync(file, 'utf8');
text = text.replace(/const itemVariants = \{/g, 'const itemVariants: any = {');
text = text.replace(/const textVariants = \{/g, 'const textVariants: any = {');
text = text.replace(/const containerVariants = \{/g, 'const containerVariants: any = {');
fs.writeFileSync(file, text);
"

node -e "
const fs = require('fs');
let file = 'src/components/WorkflowStepper.tsx';
let text = fs.readFileSync(file, 'utf8');
text = text.replace(\"import { Box, Wand2, Download, ArrowRight } from 'lucide-react';\", \"import { Box, Wand2, Download, ArrowRight } from 'lucide-react';\\nimport { AppView } from '@/types';\");
text = text.replace(\"onViewChange: (view: string) => void;\", \"onViewChange: (view: AppView) => void;\");
text = text.replace(\"onClick={() => onViewChange(step.id)}\", \"onClick={() => onViewChange(step.id as AppView)}\");
fs.writeFileSync(file, text);
"

node -e "
const fs = require('fs');
let file = 'src/components/AssetSection.tsx';
let text = fs.readFileSync(file, 'utf8');
text = text.replace(/interface AssetSectionProps \{/g, 'interface AssetSectionProps {\\n  description?: string;');
text = text.replace(/onRemove: \(id: string\) => void;\\n  onApiError: \(error: any, operation: string, path: string\) => void;\\n\}/,
\"onRemove: (id: string) => void;\\n  onApiError?: (error: any, operation: string, path: string) => void;\\n  onSynthesize?: (prompt: string) => Promise<void>;\\n  isGenerating?: boolean;\\n}\");
text = text.replace(/icon: React\.ReactNode;\\n  type: 'product' \\| 'logo' \\| 'model3d';/, \"icon?: React.ReactNode;\\n  type?: 'product' | 'logo' | 'model3d';\");
text = text.replace(/onAdd: \(asset: Asset\) => void;/g, 'onAdd: (data: string) => void;');
text = text.replace(/onUpload=\{\(data, name\) => onAdd\(\{ id: Math\.random\(\)\.toString\(36\)\.substr\(2, 9\), type, name, data \}\)\}/,
\`onFileSelect={(file) => {
            const reader = new FileReader();
            reader.onload = (e) => {
              if (e.target?.result) {
                onAdd(e.target.result as string);
              }
            };
            reader.readAsDataURL(file);
          }}\`);
fs.writeFileSync(file, text);
"

node -e "
const fs = require('fs');
function fixFile(file) {
  if (!fs.existsSync(file)) return;
  let text = fs.readFileSync(file, 'utf8');
  text = text.replace(/from '\\.\\.\\/\\.\\.\\/components/g, \"from '@/components\");
  text = text.replace(/from '\\.\\.\\/\\.\\.\\/services/g, \"from '@/services\");
  text = text.replace(/from '\\.\\.\\/hooks/g, \"from '@/hooks\");
  text = text.replace(/from '\\.\\.\\/types'/g, \"from '@/types'\");
  text = text.replace(/interface Asset \\{[^}]+\\}/g, \"import { Asset } from '@/types';\");
  text = text.replace(/interface GeneratedMockup \\{[^}]+\\}/g, \"import { GeneratedMockup } from '@/types';\");
  fs.writeFileSync(file, text);
}
fixFile('src/components/DashboardView.tsx');
fixFile('src/components/ForgeView.tsx');
fixFile('src/components/GalleryView.tsx');
fixFile('src/components/StudioView.tsx');
fixFile('src/components/AssetSection.tsx');
fixFile('src/components/Lightbox.tsx');
"

echo "Done!"
