#!/bin/zsh
# ── Публикация «Добродошли» на GitHub Pages одной командой ────────────────
# Перед первым запуском (один раз): ~/.local/bin/gh auth login
set -e
cd "$(dirname "$0")"

GH="$HOME/.local/bin/gh"
command -v gh >/dev/null 2>&1 && GH="gh"
if [ ! -x "$GH" ] && ! command -v gh >/dev/null 2>&1; then
  echo "Не найден gh. Запусти меня ещё раз после установки (см. README)."; exit 1
fi
"$GH" auth status >/dev/null 2>&1 || { echo "Сначала войди в GitHub: $GH auth login"; exit 1; }

# чтобы git push никогда не спрашивал логин/пароль — пускаем его через gh
GH_ABS="$GH"; command -v "$GH" >/dev/null 2>&1 && GH_ABS="$(command -v "$GH")"
git config --global "credential.https://github.com.helper" "!$GH_ABS auth git-credential" 2>/dev/null || true

git add -A
git commit -m "update $(date '+%Y-%m-%d %H:%M')" >/dev/null 2>&1 || echo "(изменений нет — публикую текущее)"

if ! git remote get-url origin >/dev/null 2>&1; then
  echo "Создаю репозиторий dobrodosli…"
  "$GH" repo create dobrodosli --public --source . --push
  echo "Включаю GitHub Pages…"
  "$GH" api -X POST "repos/{owner}/dobrodosli/pages" -f "source[branch]=main" -f "source[path]=/" >/dev/null 2>&1 || true
else
  git push
fi

USER_LOGIN=$("$GH" api user -q .login)
echo ""
echo "✅ Готово. Сайт: https://${USER_LOGIN}.github.io/dobrodosli/"
echo "   (после первой публикации подожди 1–2 минуты)"
