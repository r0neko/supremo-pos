const Build = {
    Major: 2,
    Minor: 11,
    Patch: 23
};

function IsProduction() {
    return process.env.NODE_ENV === "production";
}

const BuildString = `${Build.Major}.${Build.Minor}.${Build.Patch}-${IsProduction() ? "production" : "dev"}`;

module.exports = {
    IsProduction,
    Build,
    BuildString
};