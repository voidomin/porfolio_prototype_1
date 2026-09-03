import { NextRequest, NextResponse } from "next/server";
import { execFile } from "child_process";
import { promisify } from "util";

const execFileAsync = promisify(execFile);

// The Next.js app (`portfolio-website/`) is a subdirectory of the git repo, not the repo
// root — but git resolves relative pathspecs fine from a subdirectory, and every path this
// route receives (public/images/..., src/data/gallery.json) is relative to this directory.
const REPO_ROOT = process.cwd();

interface CommitRequestBody {
  files: string[];
  message: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: CommitRequestBody = await request.json();
    const { files, message } = body;

    if (!files || files.length === 0 || !message) {
      return NextResponse.json({ error: "files and message are required" }, { status: 400 });
    }

    // Only allow committing paths under the two directories this workflow writes to.
    const allowedPrefixes = ["public/images/photography/", "src/data/gallery.json"];
    const invalid = files.filter(
      (f) => !allowedPrefixes.some((prefix) => f === prefix || f.startsWith(prefix))
    );
    if (invalid.length > 0) {
      return NextResponse.json(
        { error: `Refusing to commit unexpected paths: ${invalid.join(", ")}` },
        { status: 400 }
      );
    }

    await execFileAsync("git", ["add", "--", ...files], { cwd: REPO_ROOT });

    const { stdout } = await execFileAsync("git", ["commit", "-m", message], {
      cwd: REPO_ROOT,
    });

    const { stdout: hash } = await execFileAsync("git", ["rev-parse", "--short", "HEAD"], {
      cwd: REPO_ROOT,
    });

    return NextResponse.json({
      success: true,
      commit: hash.trim(),
      summary: stdout.trim(),
    });
  } catch (error: any) {
    // "nothing to commit" is not fatal — treat it as a no-op success.
    const output = `${error.stdout || ""}${error.stderr || ""}`;
    if (/nothing to commit/i.test(output)) {
      return NextResponse.json({ success: true, commit: null, summary: "Nothing to commit" });
    }
    return NextResponse.json({ error: output || error.message }, { status: 500 });
  }
}
