using System.Text.Json;

namespace PaddleThroughLychnidos.Domain.Shared
{
    public static class OpenNowCalculator
    {
        // Returns null when hoursJson is null/empty/unparseable - "unknown",
        // not "closed". Only returns true/false once structured hours
        // actually exist for the shop.
        public static bool? IsOpenAt(string? hoursJson, DateTimeOffset instant)
        {
            if (string.IsNullOrWhiteSpace(hoursJson))
            {
                return null;
            }

            List<WeeklyHoursEntry>? entries;
            try
            {
                entries = JsonSerializer.Deserialize<List<WeeklyHoursEntry>>(hoursJson);
            }
            catch (JsonException)
            {
                return null;
            }

            if (entries == null || entries.Count == 0)
            {
                return null;
            }

            var localTime = instant.LocalDateTime;
            var today = localTime.DayOfWeek;
            var yesterday = (DayOfWeek)(((int)today + 6) % 7);
            var timeOfDay = TimeOnly.FromDateTime(localTime);

            foreach (var entry in entries)
            {
                if (entry.OpensAt <= entry.ClosesAt)
                {
                    // Same-day window, e.g. 09:00-18:00.
                    if (entry.DayOfWeek == today &&
                        timeOfDay >= entry.OpensAt &&
                        timeOfDay < entry.ClosesAt)
                    {
                        return true;
                    }
                }
                else
                {
                    // Overnight window, e.g. 20:00-02:00: open from OpensAt
                    // until midnight on DayOfWeek, then midnight until
                    // ClosesAt on the following day.
                    if (entry.DayOfWeek == today && timeOfDay >= entry.OpensAt)
                    {
                        return true;
                    }
                    if (entry.DayOfWeek == yesterday && timeOfDay < entry.ClosesAt)
                    {
                        return true;
                    }
                }
            }

            return false;
        }
    }
}
