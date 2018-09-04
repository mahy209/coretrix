function removeTimeRange(range, ranges, exists) {
    if (range.end <= range.start) {
        return false;
    }
    if (!ranges) {
        return [{
            start: 0,
            end: range.start
        }, {
            start: range.end,
            end: 1440
        }];
    } else {
        var found = false;
        for (var i = 0; i < ranges.length; i++) {
            var rn = ranges[i];
            if (rn.start <= range.start && rn.end >= range.end) {
                found = true;
                if (rn.start == range.start && rn.end == range.end) {
                    ranges.splice(i, 1);
                    return ranges;
                }
                if (rn.start != range.start) {
                    ranges.splice(i, 1, {
                        start: rn.start,
                        end: range.start
                    });
                } else {
                    ranges.splice(i, 1, {
                        start: range.end,
                        end: rn.end
                    });
                    return ranges;
                }
                if (rn.end != range.end) {
                    ranges.splice(i + 1, 0, {
                        start: range.end,
                        end: rn.end
                    });
                } else {
                    ranges.splice(i, 1, {
                        start: rn.start,
                        end: range.start
                    });
                    return ranges;
                }
                return ranges;
            }
        }
        if (!found) {
            return false;
        }
    }
}
