#!/usr/bin/python

#
# Build script for WBIB.  Checks the scripts using the Closure Linter and
# compiles them using the Closure Compiler.
#

import os
import subprocess
import sys


### CONFIGURATION BEGINS HERE

languages = ['en']

js_files = [
        # Common library
        'utils.js',
        'list_manager.js',
        # UI
        'list_page.js',
        # Final set-up hook
        'onload.js',
]

### Parts you most likely care about are above.

header = """
/**
 * @license Copyright (C) 2015 Victor Vasiliev
 *
 * The following code is available under the terms of two following licenses.
 * You are free to use, modify and/or redistribute it under either of them.
 *
 * License 1:
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 * License 2:
 * This work is available under Creative Commons Attribution-ShareAlike 3.0
 * Unported license.  See <https://creativecommons.org/licenses/by-sa/3.0/>
 * for full text and details.
 */

window.WBIBCode = function() {
"""
footer = """};

window.WBIBCode();
$(document).ready(function() {
  window.WBIBListManager.init(window.WBIBDBLoaded);
});
"""

cc_call = ['closure-compiler',
           '--language_in', 'ECMASCRIPT5_STRICT']
lint_call = ['gjslint']

srcdir = os.path.dirname(os.path.abspath(__file__))
outdir = os.path.join(srcdir, 'out')

### CONFIGURATION ENDS HERE

def cmd(args):
    process = subprocess.Popen(args,
                                stdout=subprocess.PIPE,
                                stderr=subprocess.PIPE)
    out, err = process.communicate()
    if process.returncode != 0:
        print >>sys.stderr, "Command failed with return code %i: %s." % (
                process.returncode, " ".join(args))
        print >>sys.stderr, out
        print >>sys.stderr, err
        sys.exit(1)
    return out

def output(name, text):
    path = os.path.join(outdir, name)
    f = open(path, 'w')
    f.write(text)
    f.close()
    return path

def main():
    if not os.path.isdir(outdir):
        os.mkdir(outdir)

    cmd(lint_call + js_files)

    for lang in languages:
        files = ['messages_%s.js' % lang] + js_files
        lines = [header]
        for filename in files:
            for line in open(os.path.join(srcdir, filename), 'r'):
                lines.append(line.rstrip())
        lines.append(footer)

        src = "\n".join(lines)
        merged_src = output('merged-%s.js' % lang, src)
        compiled_src = cmd(cc_call + [merged_src])
        output('compiled-%s.js' % lang, compiled_src)

if __name__ == '__main__':
    main()
